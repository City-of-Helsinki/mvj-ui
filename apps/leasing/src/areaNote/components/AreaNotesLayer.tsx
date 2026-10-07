import React, { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import L from "leaflet";
import LeafletGeoJSONLayer from "@/components/map/LeafletGeoJSONLayer";
import { initializeAreaNote, showEditMode } from "@/areaNote/slice";
import { Methods } from "@/enums";
import {
  convertAreaNoteListToGeoJson,
  convertFeatureToFeatureCollection,
} from "@/areaNote/helpers";
import { getUserFullName } from "@/users/helpers";
import { formatDate, isMethodAllowed } from "@/util/helpers";
import {
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

const AreaNotesLayer: React.FC<Props> = ({
  allowToEdit = false,
  areaNotes,
  defaultAreaNote,
}) => {
  const dispatch = useAppDispatch();
  const areaNoteMethods: MethodsType = useAppSelector(getAreaNoteMethods);
  const isEditMode = useAppSelector(getIsEditMode);

  const areaNotesGeoJson = useMemo(() => {
    return convertAreaNoteListToGeoJson(areaNotes);
  }, [areaNotes]);

  const onEachFeature = useCallback(
    (feature: GeoJSON.Feature, layer: L.Layer) => {
      if (feature.properties) {
        const { id, modified_at, note, user } = feature.properties;
        layer.bindPopup(`<p>
          <strong>${formatDate(modified_at)} ${getUserFullName(user)}</strong><br/>
          ${note || "-"}
        </p>`);

        if (id === defaultAreaNote) {
          if (layer instanceof L.Path) {
            layer.setStyle({ fillOpacity: 0.9 });
          }
          window.setTimeout(() => layer.openPopup(), 100);
        }
      }

      layer.on({
        click: (event: L.LeafletMouseEvent) => {
          if (
            !feature.properties ||
            !isMethodAllowed(areaNoteMethods, Methods.PATCH) ||
            !allowToEdit
          ) {
            return;
          }

          dispatch(
            initializeAreaNote({
              geoJSON: convertFeatureToFeatureCollection(feature),
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
        mouseover: (event: L.LeafletMouseEvent) => {
          if (!isEditMode && event.target instanceof L.Path) {
            event.target.setStyle({ fillOpacity: 0.7 });
          }
        },
        mouseout: (event: L.LeafletMouseEvent) => {
          if (!isEditMode && event.target instanceof L.Path) {
            event.target.setStyle({ fillOpacity: 0.2 });
          }
        },
      });
    },
    [allowToEdit, areaNoteMethods, defaultAreaNote, dispatch, isEditMode],
  );

  return (
    <LeafletGeoJSONLayer
      data={areaNotesGeoJson}
      onEachFeature={onEachFeature}
      style={{
        color: "#2196f3",
      }}
    />
  );
};

export default AreaNotesLayer;
