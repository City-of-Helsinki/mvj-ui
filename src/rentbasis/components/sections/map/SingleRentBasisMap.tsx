import React, { Component } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import AreaNotesEditMap from "areaNote/components/AreaNotesEditMap";
import AreaNotesLayer from "areaNote/components/AreaNotesLayer";
import RentBasisLayer from "./RentBasisLayer";
import { fetchAreaNoteList } from "areaNote/actions";
import { MAP_COLORS } from "util/constants";
import { RentBasisFieldPaths } from "rentbasis/enums";
import { UsersPermissions } from "usersPermissions/enums";
import { getContentRentBasisGeoJson } from "rentbasis/helpers";
import { getFieldOptions, hasPermissions, isFieldAllowedToRead } from "util/helpers";
import { getBoundsFromCoordinates, getCenterFromCoordinates, getCoordinatesOfGeometry } from "util/map";
import { getAreaNoteList } from "areaNote/selectors";
import { getAttributes as getRentBasisAttributes, getRentBasis } from "rentbasis/selectors";
import { getUsersPermissions } from "usersPermissions/selectors";
import type { Attributes, LeafletGeoJson } from "types";
import type { RentBasis } from "rentbasis/types";
import type { AreaNoteList } from "areaNote/types";
import type { UsersPermissions as UsersPermissionsType } from "usersPermissions/types";
type Props = {
  areaNotes: AreaNoteList;
  fetchAreaNoteList: (...args: Array<any>) => any;
  rentBasis: RentBasis;
  rentBasisAttributes: Attributes;
  usersPermissions: UsersPermissionsType;
};
type State = {
  bounds?: Record<string, any> | null | undefined;
  center: Array<Record<string, any>> | null | undefined;
  financingOptions: Array<Record<string, any>>;
  geoJSON: LeafletGeoJson;
  indexOptions: Array<Record<string, any>>;
  managementOptions: Array<Record<string, any>>;
  plotTypeOptions: Array<Record<string, any>>;
  rentBasis: RentBasis;
  rentBasisAttributes: Attributes;
};

class SingleRentBasisMap extends Component<Props, State> {
  state = {
    bounds: undefined,
    center: undefined,
    financingOptions: [],
    geoJSON: {
      type: 'FeatureCollection',
      features: []
    },
    indexOptions: [],
    managementOptions: [],
    overlayLayers: [],
    plotTypeOptions: [],
    rentBasis: {},
    rentBasisAttributes: null
  };

  componentDidMount() {
    const {
      fetchAreaNoteList,
      usersPermissions
    } = this.props;

    if (hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE)) {
      fetchAreaNoteList({});
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.rentBasis !== state.rentBasis) {
      const coordinates = getCoordinatesOfGeometry(props.rentBasis.geometry);
      newState.rentBasis = props.rentBasis;
      newState.bounds = coordinates.length ? getBoundsFromCoordinates(coordinates) : undefined;
      newState.center = coordinates.length ? getCenterFromCoordinates(coordinates) : undefined;
      newState.geoJSON = getContentRentBasisGeoJson(props.rentBasis);
    }

    if (props.rentBasisAttributes !== state.rentBasisAttributes) {
      newState.rentBasisAttributes = props.rentBasisAttributes;
      newState.financingOptions = getFieldOptions(props.rentBasisAttributes, RentBasisFieldPaths.FINANCING);
      newState.indexOptions = getFieldOptions(props.rentBasisAttributes, RentBasisFieldPaths.INDEX, true);
      newState.managementOptions = getFieldOptions(props.rentBasisAttributes, RentBasisFieldPaths.MANAGEMENT);
      newState.plotTypeOptions = getFieldOptions(props.rentBasisAttributes, RentBasisFieldPaths.PLOT_TYPE);
    }

    return newState;
  }

  getOverlayLayers = () => {
    const {
      financingOptions,
      geoJSON,
      indexOptions,
      managementOptions,
      plotTypeOptions
    } = this.state;
    const {
      areaNotes,
      rentBasisAttributes,
      usersPermissions
    } = this.props;
    const layers = [];

    if (isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.GEOMETRY)) {
      layers.push({
        checked: true,
        component: <RentBasisLayer color={MAP_COLORS[0]} financingOptions={financingOptions} geoJSON={geoJSON} indexOptions={indexOptions} managementOptions={managementOptions} plotTypeOptions={plotTypeOptions} />,
        name: 'Vuokrausperiaatteet'
      });
    }

    {
      hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE) && !isEmpty(areaNotes) && layers.push({
        checked: false,
        component: <AreaNotesLayer key='area_notes' allowToEdit={false} areaNotes={areaNotes} />,
        name: 'Muistettavat ehdot'
      });
    }
    return layers;
  };

  render() {
    const {
      bounds,
      center
    } = this.state;
    const overlayLayers = this.getOverlayLayers();
    return <AreaNotesEditMap allowToEdit={false} bounds={bounds} center={center} overlayLayers={overlayLayers} />;
  }

}

export default flowRight(connect(state => {
  return {
    areaNotes: getAreaNoteList(state),
    rentBasis: getRentBasis(state),
    rentBasisAttributes: getRentBasisAttributes(state),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  fetchAreaNoteList
}))(SingleRentBasisMap);