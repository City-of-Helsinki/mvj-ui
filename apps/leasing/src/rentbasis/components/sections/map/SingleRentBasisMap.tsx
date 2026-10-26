import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/root/hooks";
import AreaNotesEditMap from "@/areaNote/components/AreaNotesEditMap";
import RentBasisLayer from "./RentBasisLayer";
import useAreaNotesOverlay from "@/components/map/useAreaNotesOverlay";
import { MAP_LAYER_COLORS } from "@/components/map/mapStyles";
import { RentBasisFieldPaths } from "@/rentbasis/enums";
import { getContentRentBasisGeoJson } from "@/rentbasis/helpers";
import { getFieldOptions, isFieldAllowedToRead } from "@/util/helpers";
import {
  getBoundsFromCoordinates,
  getCenterFromCoordinates,
  getCoordinatesOfGeometry,
} from "@/util/map";
import {
  getAttributes as getRentBasisAttributes,
  getRentBasis,
} from "@/rentbasis/selectors";
import type { Attributes, LeafletGeoJson } from "types";
import type { LatLngBounds } from "leaflet";

const SingleRentBasisMap: React.FC = () => {
  const rentBasis = useAppSelector(getRentBasis);
  const rentBasisAttributes: Attributes = useAppSelector(
    getRentBasisAttributes,
  );
  const areaNotesOverlay = useAreaNotesOverlay({ fetchOnMount: true });
  const [bounds, setBounds] = useState<LatLngBounds>();
  const [center, setCenter] = useState<[number, number]>();

  const [financingOptions, setFinancingOptions] = useState([]);
  const [geoJSON, setGeoJSON] = useState<LeafletGeoJson>({
    type: "FeatureCollection",
    features: [],
  });
  const [indexOptions, setIndexOptions] = useState([]);
  const [managementOptions, setManagementOptions] = useState([]);
  const [plotTypeOptions, setPlotTypeOptions] = useState([]);

  useEffect(() => {
    if (rentBasis) {
      const coordinates = getCoordinatesOfGeometry(rentBasis.geometry);
      setGeoJSON(getContentRentBasisGeoJson(rentBasis));
      setBounds(
        coordinates.length ? getBoundsFromCoordinates(coordinates) : undefined,
      );
      setCenter(
        coordinates.length ? getCenterFromCoordinates(coordinates) : undefined,
      );
    }
  }, [rentBasis]);

  useEffect(() => {
    if (rentBasisAttributes) {
      setFinancingOptions(
        getFieldOptions(rentBasisAttributes, RentBasisFieldPaths.FINANCING),
      );
      setIndexOptions(
        getFieldOptions(rentBasisAttributes, RentBasisFieldPaths.INDEX, true),
      );
      setManagementOptions(
        getFieldOptions(rentBasisAttributes, RentBasisFieldPaths.MANAGEMENT),
      );
      setPlotTypeOptions(
        getFieldOptions(rentBasisAttributes, RentBasisFieldPaths.PLOT_TYPE),
      );
    }
  }, [rentBasisAttributes]);

  const getOverlayLayers = () => {
    const layers = [];

    if (
      isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.GEOMETRY)
    ) {
      layers.push({
        checked: true,
        component: (
          <RentBasisLayer
            color={MAP_LAYER_COLORS[0]}
            financingOptions={financingOptions}
            geoJSON={geoJSON}
            indexOptions={indexOptions}
            managementOptions={managementOptions}
            plotTypeOptions={plotTypeOptions}
          />
        ),
        name: "Vuokrausperiaatteet",
      });
    }

    if (areaNotesOverlay) {
      layers.push(areaNotesOverlay);
    }
    return layers;
  };

  const overlayLayers = getOverlayLayers();
  return (
    <AreaNotesEditMap
      allowToEdit={false}
      bounds={bounds}
      center={center}
      overlayLayers={overlayLayers}
    />
  );
};

export default SingleRentBasisMap;
