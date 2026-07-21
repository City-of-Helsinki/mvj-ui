import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash-es";
import AreaNotesEditMap from "@/areaNote/components/AreaNotesEditMap";
import AreaNotesLayer from "@/areaNote/components/AreaNotesLayer";
import RentBasisLayer from "./RentBasisLayer";
import { fetchAreaNoteList } from "@/areaNote/actions";
import { MAP_COLORS } from "@/util/constants";
import { RentBasisFieldPaths } from "@/rentbasis/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getContentRentBasisGeoJson } from "@/rentbasis/helpers";
import {
  getFieldOptions,
  hasPermissions,
  isFieldAllowedToRead,
} from "@/util/helpers";
import {
  getBoundsFromCoordinates,
  getCenterFromCoordinates,
  getCoordinatesOfGeometry,
} from "@/util/map";
import { getAreaNoteList } from "@/areaNote/selectors";
import {
  getAttributes as getRentBasisAttributes,
  getRentBasis,
} from "@/rentbasis/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes, LeafletGeoJson } from "types";
import type { LatLngBounds } from "leaflet";

const SingleRentBasisMap: React.FC = () => {
  const dispatch = useDispatch();

  const areaNotes = useSelector(getAreaNoteList);
  const rentBasis = useSelector(getRentBasis);
  const rentBasisAttributes: Attributes = useSelector(getRentBasisAttributes);
  const usersPermissions = useSelector(getUsersPermissions);
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
    if (hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE)) {
      dispatch(fetchAreaNoteList({}));
    }
  }, [dispatch, usersPermissions]);

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
            color={MAP_COLORS[0]}
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

    {
      hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE) &&
        !isEmpty(areaNotes) &&
        layers.push({
          checked: false,
          component: (
            <AreaNotesLayer
              key="area_notes"
              allowToEdit={false}
              areaNotes={areaNotes}
            />
          ),
          name: "Muistettavat ehdot",
        });
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
