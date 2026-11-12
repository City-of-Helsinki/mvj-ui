import React, { useContext, useEffect, useRef, useState } from "react";
import { IconDrag, IconMap } from "hds-react";
import { enqueueNotification } from "@/components/notification/notificationService";
import { OverlayLayerActiveContext } from "@/areaNote/components/MapContainer";
import LeafletGeoJSONLayer from "@/components/map/LeafletGeoJSONLayer";
import useGeoJsonFeatureInteractions from "@/components/map/useGeoJsonFeatureInteractions";
import { fetchIntersectingArchivedAreas } from "@/leases/requestsAsync";
import { html } from "@/util/html";
import { formatDate } from "@/util/helpers";
import ExternalLink from "@/components/links/ExternalLink";
import { getRouteById, Routes } from "@/root/routes";
import type { LeafletGeoJson } from "types";
import "./ArchivedLeaseAreasLayer.scss";

const getPopupContent = (feature: GeoJSON.Feature) => {
  const { identifier, lease } = feature.properties ?? {};
  return html`<p class="title"><strong>Päättynyt vuokraus</strong></p>
    <p><strong>Vuokraustunnus:</strong> ${lease?.identifier}</p>
    <p><strong>Vuokrakohde:</strong> ${identifier}</p>
    <p><strong>Päättymispäivä:</strong> ${formatDate(lease?.end_date)}</p>`;
};

const ArchivedLeaseAreasLayer = ({ leaseId }: { leaseId: number }) => {
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
  const isActive = useContext(OverlayLayerActiveContext);
  const onEachFeature = useGeoJsonFeatureInteractions({ getPopupContent });
  const groups = Array.from(
    new Set(data?.features.map((feature) => feature.properties.lease.id) ?? []),
  )
    .map((id) => {
      const features = data.features.filter(
        (feature) => feature.properties.lease.id === id,
      );
      return { ...features[0].properties.lease, features };
    })
    .sort(
      (first, second) =>
        second.end_date.localeCompare(first.end_date) ||
        first.identifier.localeCompare(second.identifier),
    );
  const visibleFeatures =
    data?.features.filter(
      (feature) => !hiddenLeases.includes(feature.properties.lease.id),
    ) ?? [];
  const activeLease = highlightedLease ?? selectedLease;

  useEffect(() => {
    if (!isActive || data) return;
    const controller = new AbortController();
    enqueueNotification(
      {
        title: "Päättyneiden vuokrausten alueet",
        body: "Haetaan päättyneiden vuokrausten alueita...",
      },
      { type: "info" },
    );
    fetchIntersectingArchivedAreas(leaseId, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setData(result);
        if (!result.features.length) {
          enqueueNotification(
            {
              title: "Päättyneet vuokraukset",
              body: "Ei leikkaavia alueita.",
            },
            { type: "info" },
          );
        }
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        enqueueNotification(
          {
            title: "Päättyneiden vuokrausten alueet",
            body: "Alueiden haku epäonnistui.",
          },
          { type: "error", timeOut: 0 },
        );
      });
    return () => {
      controller.abort();
    };
  }, [leaseId, isActive, data]);

  return (
    <>
      {data && data.features.length > 0 ? (
        <>
          <LeafletGeoJSONLayer
            data={{ ...data, features: visibleFeatures }}
            onEachFeature={onEachFeature}
            style={{ color: "#607D3B", dashArray: "6 4" }}
          />
          {activeLease !== null && (
            <LeafletGeoJSONLayer
              data={{
                ...data,
                features: visibleFeatures.filter(
                  (feature) => feature.properties.lease.id === activeLease,
                ),
              }}
              onEachFeature={onEachFeature}
              style={{ color: "#006D77", weight: 4, fillOpacity: 0.5 }}
            />
          )}
          <details ref={panelRef} className="archived-lease-panel" open>
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
                  maxLeft: Math.max(
                    0,
                    container.clientWidth - panel.offsetWidth,
                  ),
                  maxTop: Math.max(
                    0,
                    container.clientHeight - panel.offsetHeight,
                  ),
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
              Päättyneet vuokraukset ({groups.length})
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
                onClick={() => setHiddenLeases(groups.map((group) => group.id))}
              >
                Piilota kaikki
              </button>
            </div>
            <ul>
              {groups.map((group) => (
                <li
                  key={group.id}
                  className={
                    activeLease === group.id ? "is-highlighted" : undefined
                  }
                  onMouseEnter={() => setHighlightedLease(group.id)}
                  onMouseLeave={() => setHighlightedLease(null)}
                  onFocus={() => setHighlightedLease(group.id)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget))
                      setHighlightedLease(null);
                  }}
                >
                  <div className="archived-lease-panel__row">
                    <input
                      type="checkbox"
                      aria-label={`Näytä vuokrauksen ${group.identifier} alueet`}
                      checked={!hiddenLeases.includes(group.id)}
                      onChange={(event) =>
                        setHiddenLeases(
                          event.target.checked
                            ? hiddenLeases.filter((id) => id !== group.id)
                            : [...hiddenLeases, group.id],
                        )
                      }
                    />
                    <div className="archived-lease-panel__lease">
                      <div className="archived-lease-panel__title">
                        <ExternalLink
                          className="no-margin"
                          href={`${getRouteById(Routes.LEASES)}/${group.id}`}
                          text={group.identifier}
                        />
                        {group.state && (
                          <span className="archived-lease-panel__state">
                            {group.state}
                          </span>
                        )}
                      </div>
                      <div className="archived-lease-panel__metadata">
                        {group.intended_use && (
                          <span>{group.intended_use}</span>
                        )}
                        <time
                          className="archived-lease-panel__end-date"
                          dateTime={group.end_date}
                        >
                          Päättynyt {formatDate(group.end_date)}
                        </time>
                      </div>
                      <button
                        className="archived-lease-panel__highlight"
                        type="button"
                        aria-label={`Korosta vuokrauksen ${group.identifier} alueet kartalla`}
                        aria-pressed={selectedLease === group.id}
                        title={
                          selectedLease === group.id
                            ? "Poista korostus kartalta"
                            : "Korosta alueet kartalla"
                        }
                        onClick={() =>
                          setSelectedLease(
                            selectedLease === group.id ? null : group.id,
                          )
                        }
                      >
                        <IconMap aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </details>
        </>
      ) : null}
    </>
  );
};

export default ArchivedLeaseAreasLayer;
