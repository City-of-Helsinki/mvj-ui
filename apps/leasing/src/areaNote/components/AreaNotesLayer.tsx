import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import { GeoJSON } from "react-leaflet";
import { initializeAreaNote, showEditMode } from "@/areaNote/actions";
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

  return (
    <GeoJSON
      key={JSON.stringify(areaNotesGeoJson)}
      data={areaNotesGeoJson}
      onEachFeature={(feature, layer) => {
        if (feature.properties) {
          const { id, modified_at, note, user } = feature.properties;
          const popupContent = `<p>
              <strong>${formatDate(modified_at)} ${getUserFullName(user)}</strong><br/>
              ${note || "-"}
            </p>`;
          layer.bindPopup(popupContent);

          if (id === defaultAreaNote) {
            layer.setStyle({
              fillOpacity: 0.9,
            });
            setTimeout(() => {
              layer.openPopup();
            }, 100);
          }
        }

        layer.on({
          click: (e: any) => {
            if (
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
            e.target.setStyle({
              fillOpacity: 0.2,
            });
          },
          mouseover: (e: any) => {
            if (!isEditMode) {
              const hoverLayer = e.target;
              hoverLayer.setStyle({
                fillOpacity: 0.7,
              });
            }
          },
          mouseout: (e: any) => {
            if (!isEditMode) {
              const hoverLayer = e.target;
              hoverLayer.setStyle({
                fillOpacity: 0.2,
              });
            }
          },
        });
      }}
      style={{
        color: "#2196f3",
      }}
    />
  );
};

export default AreaNotesLayer;
