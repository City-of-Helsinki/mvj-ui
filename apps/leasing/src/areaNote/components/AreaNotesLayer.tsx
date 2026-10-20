import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import L from "leaflet";
import type {} from "@geoman-io/leaflet-geoman-free";
import LeafletGeoJSONLayer from "@/components/map/LeafletGeoJSONLayer";
import useGeoJsonFeatureInteractions from "@/components/map/useGeoJsonFeatureInteractions";
import { initializeAreaNote, showEditMode } from "@/areaNote/slice";
import { Methods } from "@/enums";
import {
  convertAreaNoteListToGeoJson,
  convertAreaNoteToPolygonFeatureCollection,
} from "@/areaNote/helpers";
import type { AreaNoteMultiPolygonFeature } from "@/areaNote/helpers";
import { getUserFullName } from "@/users/helpers";
import { formatDate, isMethodAllowed } from "@/util/helpers";
import { html } from "@/util/html";
import {
  getInitialAreaNote,
  getIsEditMode,
  getMethods as getAreaNoteMethods,
} from "@/areaNote/selectors";
import type { Methods as MethodsType } from "types";
import type { AreaNoteList } from "@/areaNote/types";

type Props = {
  allowToEdit?: boolean;
  areaNotes: AreaNoteList;
  defaultAreaNote?: number | null | undefined;
};

const AREA_NOTE_OPTIONS: L.PathOptions & Pick<L.LayerOptions, "pmIgnore"> = {
  color: "#2196f3",
  // Saved overlays remain read-only while the selected note is edited as a draft.
  pmIgnore: true,
};

const AreaNotesLayer: React.FC<Props> = ({
  allowToEdit = false,
  areaNotes,
  defaultAreaNote,
}) => {
  const dispatch = useAppDispatch();
  const areaNoteMethods: MethodsType = useAppSelector(getAreaNoteMethods);
  const initialAreaNote = useAppSelector(getInitialAreaNote);
  const isEditMode = useAppSelector(getIsEditMode);
  const mapRef = useRef<L.Map | null>(null);
  const previousIsEditModeRef = useRef(isEditMode);

  const areaNotesGeoJson = useMemo(() => {
    // The selected saved overlay is replaced by purple draft layers while editing.
    const areaNotesForSavedOverlay = isEditMode
      ? areaNotes.filter((areaNote) => areaNote.id !== initialAreaNote.id)
      : areaNotes;

    return convertAreaNoteListToGeoJson(areaNotesForSavedOverlay);
  }, [areaNotes, initialAreaNote.id, isEditMode]);

  const getPopupContent = useCallback((feature: GeoJSON.Feature) => {
    const { modified_at, note, user } = feature.properties ?? {};
    return html`<p>
      <strong>${formatDate(modified_at)} ${getUserFullName(user)}</strong><br />
      ${note || "-"}
    </p>`;
  }, []);
  const onClick = useCallback(
    (feature: GeoJSON.Feature, event: L.LeafletMouseEvent) => {
      if (
        isEditMode ||
        !feature.properties ||
        !isMethodAllowed(areaNoteMethods, Methods.PATCH) ||
        !allowToEdit
      ) {
        return;
      }

      dispatch(
        initializeAreaNote({
          geoJSON: convertAreaNoteToPolygonFeatureCollection(
            feature as AreaNoteMultiPolygonFeature,
          ),
          id: feature.properties.id,
          isNew: false,
          note: feature.properties.note,
        }),
      );
      dispatch(showEditMode());
      if (event.target instanceof L.Path) {
        event.target.setStyle({ fillOpacity: 0.2 });
      }
    },
    [allowToEdit, areaNoteMethods, dispatch, isEditMode],
  );
  const isHighlighted = useCallback(
    (feature: GeoJSON.Feature) => feature.properties?.id === defaultAreaNote,
    [defaultAreaNote],
  );
  const isHoverEnabled = useCallback(() => !isEditMode, [isEditMode]);
  const onEachFeatureInteractions = useGeoJsonFeatureInteractions({
    getPopupContent,
    isHighlighted,
    isHoverEnabled,
    onClick,
  });
  const onEachFeature = useCallback(
    (feature: GeoJSON.Feature, layer: L.Layer) => {
      onEachFeatureInteractions(feature, layer);
      layer.on("add", () => {
        mapRef.current = (layer as L.Layer & { _map?: L.Map })._map ?? null;
      });
    },
    [onEachFeatureInteractions],
  );

  useEffect(() => {
    if (previousIsEditModeRef.current && !isEditMode) {
      mapRef.current?.closePopup();
    }

    previousIsEditModeRef.current = isEditMode;
  }, [isEditMode]);

  return (
    <LeafletGeoJSONLayer
      data={areaNotesGeoJson}
      onEachFeature={onEachFeature}
      style={AREA_NOTE_OPTIONS}
    />
  );
};

export default AreaNotesLayer;
