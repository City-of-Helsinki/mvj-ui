import React, { useCallback } from "react";
import LeafletGeoJSONLayer from "@/components/map/LeafletGeoJSONLayer";
import useGeoJsonFeatureInteractions from "@/components/map/useGeoJsonFeatureInteractions";
import { flowRight } from "lodash-es";
import { getRouteById, Routes } from "@/root/routes";
import type { Attributes, LeafletGeoJson } from "types";
import { withAreaSearchAttributes } from "@/components/attributes/AreaSearchAttributes";
import { formatDate, getFieldOptions, getLabelOfOption } from "@/util/helpers";
import { html } from "@/util/html";
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
    (feature: GeoJSON.Feature) => {
      const search = feature.properties?.search;
      if (!search) return;

      return html` <p class="title">
          <strong
            ><a href="${getSearchLink(search.id)}"
              >${search.identifier}</a
            ></strong
          >
        </p>
        <p>
          ${search.address ? `${search.address}, ` : ""}${search.district || ""}
        </p>
        <p>
          ${formatDate(search.start_date) || "??.??.????"}-${formatDate(search.end_date) || ""}
        </p>
        <p>
          <strong>Käyttötarkoitus: </strong
          >${getLabelOfOption(intendedUseOptions, search.intended_use) || "-"}
        </p>
        <p>
          <strong>Vuokranantaja: </strong
          >${getLabelOfOption(lessorOptions, search.lessor) || "-"}
        </p>
        <p>
          <strong>Tila: </strong
          >${getLabelOfOption(stateOptions, search.state) || "-"}
        </p>`;
    },
    [intendedUseOptions, lessorOptions, stateOptions],
  );
  const onEachFeature = useGeoJsonFeatureInteractions({ getPopupContent });

  return (
    <LeafletGeoJSONLayer
      data={areaSearchesGeoJson}
      style={{ color }}
      onEachFeature={onEachFeature}
    />
  );
};

export default flowRight(withAreaSearchAttributes)(
  AreaSearchLayer,
) as React.ComponentType<OwnProps>;
