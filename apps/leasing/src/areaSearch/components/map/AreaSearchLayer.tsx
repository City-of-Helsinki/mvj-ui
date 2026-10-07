import React, { useCallback } from "react";
import L from "leaflet";
import LeafletGeoJSONLayer from "@/components/map/LeafletGeoJSONLayer";
import { flowRight } from "lodash-es";
import { getRouteById, Routes } from "@/root/routes";
import type { Attributes, LeafletGeoJson } from "types";
import { withAreaSearchAttributes } from "@/components/attributes/AreaSearchAttributes";
import { formatDate, getFieldOptions, getLabelOfOption } from "@/util/helpers";
type OwnProps = {
  color: string;
  areaSearchesGeoJson: LeafletGeoJson;
  stateOptions: Array<Record<string, any>>;
};
type Props = OwnProps & {
  areaSearchAttributes: Attributes;
};

const AreaSearchLayer: React.FC<Props> = ({
  color,
  areaSearchesGeoJson,
  areaSearchAttributes,
}) => {
  const intendedUseOptions = getFieldOptions(
    areaSearchAttributes,
    "intended_use",
  );
  const stateOptions = getFieldOptions(areaSearchAttributes, "state");
  const lessorOptions = getFieldOptions(areaSearchAttributes, "lessor");

  const getSearchLink = (id: number) => {
    return `${getRouteById(Routes.AREA_SEARCH)}/${id}`;
  };

  const getPopupContent = useCallback(
    (
      search: Record<string, any>,
    ) => `<p class="title"><strong><a href="${getSearchLink(search.id)}">${search.identifier}</a></strong></p>
      <p>${search.address ? search.address + ", " : ""}${search.district || ""}</p>
      <p>${formatDate(search.start_date) || "??.??.????"}–${formatDate(search.end_date) || ""}</p>
      <p><strong>Käyttötarkoitus: </strong>${getLabelOfOption(intendedUseOptions, search.intended_use) || "-"}</p>
      <p><strong>Vuokranantaja: </strong>${getLabelOfOption(lessorOptions, search.lessor) || "-"}</p>
      <p><strong>Tila: </strong>${getLabelOfOption(stateOptions, search.state) || "-"}</p>`,
    [intendedUseOptions, lessorOptions, stateOptions],
  );

  return (
    <LeafletGeoJSONLayer
      data={areaSearchesGeoJson}
      style={{ color }}
      onEachFeature={(feature, layer) => {
        const search = feature.properties?.search;
        if (!search) return;
        layer.bindPopup(getPopupContent(search));
        layer.on({
          mouseover: () =>
            layer instanceof L.Path && layer.setStyle({ fillOpacity: 0.7 }),
          mouseout: () =>
            layer instanceof L.Path && layer.setStyle({ fillOpacity: 0.2 }),
        });
      }}
    />
  );
};

export default flowRight(withAreaSearchAttributes)(
  AreaSearchLayer,
) as React.ComponentType<OwnProps>;
