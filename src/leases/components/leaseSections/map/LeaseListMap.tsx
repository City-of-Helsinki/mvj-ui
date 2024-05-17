import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import AreaNotesLayer from "src/areaNote/components/AreaNotesLayer";
import AreaNotesEditMap from "src/areaNote/components/AreaNotesEditMap";
import LeaseListLayer from "./LeaseListLayer";
import { DEFAULT_ZOOM, MAP_COLORS } from "src/constants";
import { MAX_ZOOM_LEVEL_TO_FETCH_LEASES } from "src/leases/constants";
import { LeaseFieldPaths } from "src/leases/enums";
import { UsersPermissions } from "src/usersPermissions/enums";
import { getContentLeasesGeoJson } from "src/leases/helpers";
import { getApiResponseResults, getFieldOptions, getUrlParams, hasPermissions } from "src/util/helpers";
import { getBoundsFromBBox, getBoundsFromFeatures } from "src/util/map";
import { getAreaNoteList } from "src/areaNote/selectors";
import { getAttributes as getLeaseAttributes, getLeasesByBBox } from "src/leases/selectors";
import { getUsersPermissions } from "src/usersPermissions/selectors";
import type { Attributes, LeafletGeoJson } from "src/types";
import type { AreaNoteList } from "src/areaNote/types";
import type { LeaseList } from "src/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "src/usersPermissions/types";

const getMapBounds = () => {
  const {
    search
  } = location;
  const searchQuery = getUrlParams(search);
  return getBoundsFromBBox(searchQuery.in_bbox);
};

const getMapCenter = () => {
  const bounds = getMapBounds();
  return bounds ? bounds.getCenter() : null;
};

const getMapZoom = () => {
  const {
    search
  } = location;
  const searchQuery = getUrlParams(search);
  return searchQuery.zoom || DEFAULT_ZOOM;
};

type Props = {
  areaNotes: AreaNoteList;
  isLoading: boolean;
  leaseAttributes: Attributes;
  leasesData: LeaseList;
  location: Record<string, any>;
  onViewportChanged: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};
type State = {
  bounds: Record<string, any> | null | undefined;
  center: Record<string, any> | null | undefined;
  leaseAttributes: Attributes;
  leasesData: LeaseList;
  leasesGeoJson: LeafletGeoJson;
  stateOptions: Array<Record<string, any>>;
  zoom: number;
};

class LeaseListMap extends PureComponent<Props, State> {
  state = {
    bounds: getMapBounds(),
    center: getMapCenter(),
    leaseAttributes: null,
    leasesData: null,
    leasesGeoJson: {
      features: [],
      type: 'FeatureCollection'
    },
    stateOptions: [],
    zoom: getMapZoom()
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if (props.leasesData !== state.leasesData) {
      newState.leasesData = props.leasesData;
      newState.leasesGeoJson = getContentLeasesGeoJson(getApiResponseResults(props.leasesData));
    }

    if (props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.stateOptions = getFieldOptions(props.leaseAttributes, LeaseFieldPaths.STATE);
    }

    return !isEmpty(newState) ? newState : null;
  }

  getOverlayLayers = () => {
    const layers = [];
    const {
      areaNotes,
      usersPermissions
    } = this.props;
    const {
      leasesGeoJson,
      stateOptions
    } = this.state;
    {
      hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE) && layers.push({
        checked: false,
        component: <AreaNotesLayer key='area_notes' allowToEdit={false} areaNotes={areaNotes} />,
        name: 'Muistettavat ehdot'
      });
    }
    layers.push({
      checked: true,
      component: <LeaseListLayer key='leases' color={MAP_COLORS[0 % MAP_COLORS.length]} leasesGeoJson={leasesGeoJson} stateOptions={stateOptions} />,
      name: 'Vuokraukset'
    });
    return layers;
  };

  getBounds() {
    const {
      bounds,
      leasesGeoJson
    } = this.state;
    const {
      location: {
        search
      }
    } = this.props;
    const searchQuery = getUrlParams(search);
    if (searchQuery && searchQuery.search && searchQuery.search.length > 6) return getBoundsFromFeatures(leasesGeoJson);else return bounds;
  }

  handleViewportChanged = (mapOptions: Record<string, any>) => {
    const {
      onViewportChanged
    } = this.props;
    this.setState({
      zoom: mapOptions.zoom
    });
    onViewportChanged(mapOptions);
  };

  render() {
    const {
      isLoading
    } = this.props;
    const {
      center,
      zoom
    } = this.state;
    const overlayLayers = this.getOverlayLayers();
    const bounds = this.getBounds();
    return <Fragment>
        <AreaNotesEditMap allowToEdit={false} bounds={bounds} center={center} isLoading={isLoading} onViewportChanged={this.handleViewportChanged} overlayLayers={overlayLayers} showZoomLevelWarning={zoom < MAX_ZOOM_LEVEL_TO_FETCH_LEASES} zoom={zoom} zoomLevelWarningText='Tarkenna lähemmäksi kartalla hakeaksesi vuokraukset' />
      </Fragment>;
  }

}

export default flowRight(withRouter, connect(state => {
  return {
    areaNotes: getAreaNoteList(state),
    leaseAttributes: getLeaseAttributes(state),
    leasesData: getLeasesByBBox(state),
    usersPermissions: getUsersPermissions(state)
  };
}))(LeaseListMap);