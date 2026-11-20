import React, { useContext, useEffect, useRef, useState } from "react";
import { IconDrag, IconLocate } from "hds-react";
import {
  ARCHIVED_LEASE_AREA_COLOR,
  MAP_LAYER_COLORS,
} from "@/components/map/mapStyles";
import { OverlayLayerActiveContext } from "@/areaNote/components/MapContainer";
import LeafletGeoJSONLayer from "@/components/map/LeafletGeoJSONLayer";
import useGeoJsonFeatureInteractions from "@/components/map/useGeoJsonFeatureInteractions";
import ExternalLink from "@/components/links/ExternalLink";
import { buildLeaseHistory } from "@/leaseHistory/helpers";
import { getContentLeaseIdentifier } from "@/leases/helpers";
import { fetchRelatedAreas } from "@/leases/requestsAsync";
import { getRouteById, Routes } from "@/root/routes";
import {
  displayUIMessage,
  formatDate,
  getFieldOptions,
  getLabelOfOption,
  isArchived,
} from "@/util/helpers";
import { html } from "@/util/html";
import type { Lease } from "@/leases/types";
import type { LeafletGeoJson } from "types";
import "./ArchivedLeaseAreasLayer.scss";
import "./RelatedLeaseAreasLayer.scss";
import {
  dismissNotification,
  enqueueNotification,
} from "@/components/notification/notificationService";
import { LeaseFieldPaths } from "@/leases/enums";
import { getAttributes as getLeaseAttributes } from "@/leases/selectors";
import { useSelector } from "react-redux";

const getPopupContent = (feature: GeoJSON.Feature) => {
  const { identifier, lease } = feature.properties ?? {};
  return html`<p><strong>Vuokraustunnus:</strong> ${lease?.identifier}</p>
    <p><strong>Vuokrakohde:</strong> ${identifier}</p>`;
};

const RelatedLeaseAreasLayer = ({ lease }: { lease: Lease }) => {
  const isActive = useContext(OverlayLayerActiveContext);
  const leaseAttributes = useSelector(getLeaseAttributes);
  const stateOptions = getFieldOptions(leaseAttributes, LeaseFieldPaths.STATE);
  const [data, setData] = useState<LeafletGeoJson>();
  const [hiddenLeases, setHiddenLeases] = useState<number[]>([]);
  const [highlightedLease, setHighlightedLease] = useState<number | null>(null);
  const [selectedLease, setSelectedLease] = useState<number | null>(null);
  const panelRef = useRef<HTMLDetailsElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    left: number;
    top: number;
    maxLeft: number;
    maxTop: number;
    moved: boolean;
  } | null>(null);
  const groups = buildLeaseHistory(lease);
  const nodes = groups.flatMap((group) =>
    group.chains.flatMap((chain) => chain.nodes),
  );
  const activeLease = highlightedLease ?? selectedLease;
  const onEachFeature = useGeoJsonFeatureInteractions({ getPopupContent });
  const visibleFeatures =
    data?.features.filter(
      (feature) =>
        feature.properties.lease.id !== lease.id &&
        !hiddenLeases.includes(feature.properties.lease.id),
    ) ?? [];
  const colorFor = (id: number) => {
    const node = nodes.find((item) => item.lease.id === id);
    if (isArchived(node?.lease)) return ARCHIVED_LEASE_AREA_COLOR;
    return MAP_LAYER_COLORS[0];
  };

  useEffect(() => {
    if (!isActive || data) return;
    const controller = new AbortController();
    const fetchAreasNotification = enqueueNotification(
      {
        title: "",
        body: "Haetaan liittyviä alueita...",
      },
      {
        type: "info",
      },
    );
    fetchRelatedAreas(lease.id, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setData(result);
        }
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        dismissNotification(fetchAreasNotification);
        enqueueNotification(
          {
            title: "Liittyvät vuokraukset",
            body: "Alueiden haku epäonnistui.",
          },
          {
            type: "error",
            timeOut: 0,
          },
        );
      });
    return () => controller.abort();
  }, [lease.id, isActive, data]);

  return (
    <>
      {data &&
        [ARCHIVED_LEASE_AREA_COLOR, MAP_LAYER_COLORS[0]].map((color) => (
          <LeafletGeoJSONLayer
            key={color}
            data={{
              ...data,
              features: visibleFeatures.filter(
                (feature) => colorFor(feature.properties.lease.id) === color,
              ),
            }}
            onEachFeature={onEachFeature}
            style={{ color, weight: 2 }}
          />
        ))}
      {data && activeLease !== null && (
        <LeafletGeoJSONLayer
          data={{
            ...data,
            features: visibleFeatures.filter(
              (feature) => feature.properties.lease.id === activeLease,
            ),
          }}
          onEachFeature={onEachFeature}
          style={{ color: colorFor(activeLease), weight: 5, fillOpacity: 0.5 }}
        />
      )}
      <details
        ref={panelRef}
        className="archived-lease-panel related-lease-panel"
        open
      >
        <summary
          onPointerDown={(event) => {
            if (
              !(event.target as Element).closest(
                ".archived-lease-panel__drag-handle",
              )
            )
              return;
            if (event.button !== 0 || !panelRef.current) return;
            const panel = panelRef.current;
            const container = panel.offsetParent as HTMLElement | null;
            if (!container) return;
            dragRef.current = {
              pointerId: event.pointerId,
              startX: event.clientX,
              startY: event.clientY,
              left: panel.offsetLeft,
              top: panel.offsetTop,
              maxLeft: Math.max(0, container.clientWidth - panel.offsetWidth),
              maxTop: Math.max(0, container.clientHeight - panel.offsetHeight),
              moved: false,
            };
            event.currentTarget.setPointerCapture(event.pointerId);
            event.stopPropagation();
          }}
          onPointerMove={(event) => {
            const drag = dragRef.current;
            if (
              !drag ||
              drag.pointerId !== event.pointerId ||
              !event.currentTarget.hasPointerCapture(event.pointerId)
            )
              return;
            const deltaX = event.clientX - drag.startX;
            const deltaY = event.clientY - drag.startY;
            if (!drag.moved && Math.hypot(deltaX, deltaY) < 4) return;
            drag.moved = true;
            const panel = panelRef.current;
            if (!panel) return;
            panel.style.left = `${Math.max(0, Math.min(drag.maxLeft, drag.left + deltaX))}px`;
            panel.style.top = `${Math.max(0, Math.min(drag.maxTop, drag.top + deltaY))}px`;
            panel.style.right = "auto";
            panel.style.bottom = "auto";
          }}
          onPointerUp={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId))
              event.currentTarget.releasePointerCapture(event.pointerId);
          }}
          onPointerCancel={() => {
            dragRef.current = null;
          }}
          onClick={(event) => {
            if (dragRef.current?.moved) event.preventDefault();
            dragRef.current = null;
          }}
        >
          Liittyvät vuokraukset ({nodes.filter((node) => !node.active).length})
          <span
            className="archived-lease-panel__drag-handle"
            title="Siirrä paneelia"
            aria-hidden="true"
          >
            <IconDrag />
          </span>
        </summary>
        <div className="archived-lease-panel__actions">
          <button type="button" onClick={() => setHiddenLeases([])}>
            Näytä kaikki
          </button>
          <button
            type="button"
            onClick={() => setHiddenLeases(nodes.map((node) => node.lease.id))}
          >
            Piilota kaikki
          </button>
        </div>
        {groups.map((group) => (
          <section key={group.serviceUnitId ?? "unknown"}>
            {groups.length > 1 && <h4>{group.serviceUnitName}</h4>}
            {group.chains.map((chain) => (
              <ul key={chain.key} className="related-lease-panel__chain">
                {chain.nodes.map((node) => {
                  const id = node.lease.id;
                  const identifier = getContentLeaseIdentifier(
                    node.lease as Lease,
                  );
                  const hasGeometry = data?.features.some(
                    (feature) => feature.properties.lease.id === id,
                  );
                  return (
                    <li
                      key={node.key}
                      className={`${isArchived(node.lease) ? "is-inactive" : ""} ${node.active ? "is-current" : ""} ${activeLease === id ? "is-highlighted" : ""}`}
                      onMouseEnter={() => setHighlightedLease(id)}
                      onMouseLeave={() => setHighlightedLease(null)}
                      onFocus={() => setHighlightedLease(id)}
                      onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget))
                          setHighlightedLease(null);
                      }}
                    >
                      <div className="archived-lease-panel__row">
                        {!node.active && (
                          <input
                            type="checkbox"
                            aria-label={`Näytä vuokrauksen ${identifier} alueet`}
                            disabled={!hasGeometry}
                            checked={
                              Boolean(hasGeometry) && !hiddenLeases.includes(id)
                            }
                            onChange={(event) =>
                              setHiddenLeases((hidden) =>
                                event.target.checked
                                  ? hidden.filter((hiddenId) => hiddenId !== id)
                                  : [...hidden, id],
                              )
                            }
                          />
                        )}
                        <div className="related-lease-panel__lease">
                          {node.active ? (
                            <strong>{identifier} (nykyinen)</strong>
                          ) : (
                            <ExternalLink
                              className="no-margin"
                              href={`${getRouteById(Routes.LEASES)}/${identifier}`}
                              text={identifier}
                            />
                          )}
                          {node.lease.state && (
                            <span className="archived-lease-panel__state">
                              {getLabelOfOption(stateOptions, node.lease.state)}
                            </span>
                          )}
                          <div>
                            {formatDate(node.startDate)} -{" "}
                            {formatDate(node.endDate)}
                          </div>
                          {data && !hasGeometry && !node.active && (
                            <span>Ei kartalla näytettäviä alueita</span>
                          )}
                        </div>
                        {!node.active && (
                          <button
                            className="archived-lease-panel__highlight"
                            type="button"
                            disabled={!hasGeometry || hiddenLeases.includes(id)}
                            aria-label={`Korosta vuokrauksen ${identifier} alueet kartalla`}
                            aria-pressed={selectedLease === id}
                            title={
                              selectedLease === id
                                ? "Poista korostus kartalta"
                                : "Korosta alueet kartalla"
                            }
                            onClick={() =>
                              setSelectedLease(selectedLease === id ? null : id)
                            }
                          >
                            <IconLocate aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ))}
          </section>
        ))}
      </details>
    </>
  );
};

export default RelatedLeaseAreasLayer;
