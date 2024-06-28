import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import AreaNotesEditMap from "/src/areaNote/components/AreaNotesEditMap";
import TargetListLayer from "/src/plotApplications/components/map/TargetListLayer";
import { DEFAULT_ZOOM, MAP_COLORS } from "/src/util/constants";
import { MAX_ZOOM_LEVEL_TO_FETCH_LEASES } from "/src/leases/constants";
import { getApplicationTargetGeoJson } from "/src/plotApplications/helpers";
import { getApiResponseResults, getUrlParams } from "/src/util/helpers";
import { getBoundsFromBBox, getBoundsFromFeatures } from "/src/util/map";
import { getAreaNoteList } from "/src/areaNote/selectors";
import { getApplicationsByBBox } from "/src/plotApplications/selectors";
import { getUsersPermissions } from "/src/usersPermissions/selectors";
import type { LeafletGeoJson } from "types";
import type { AreaNoteList } from "/src/areaNote/types";
import type { PlotApplicationsList } from "/src/plotApplications/types";
import type { UsersPermissions as UsersPermissionsType } from "/src/usersPermissions/types";

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

type OwnProps = {
  allowToEdit: boolean;
  isLoading: boolean;
  onViewportChanged: (...args: Array<any>) => any;
};
type Props = OwnProps & {
  areaNotes: AreaNoteList;
  applicationsData: PlotApplicationsList;
  location: Record<string, any>;
  usersPermissions: UsersPermissionsType;
};
type State = {
  bounds: Record<string, any> | null | undefined;
  center: Record<string, any> | null | undefined;
  applicationsData: PlotApplicationsList;
  applicationsGeoJson: LeafletGeoJson;
  stateOptions: Array<Record<string, any>>;
  zoom: number;
};

class ApplicationListMap extends PureComponent<Props, State> {
  state = {
    bounds: getMapBounds(),
    center: getMapCenter(),
    leaseAttributes: null,
    leasesData: null,
    applicationsData: [],
    applicationsGeoJson: {
      features: [],
      type: 'FeatureCollection'
    },
    stateOptions: [],
    zoom: getMapZoom()
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (JSON.stringify(props.applicationsData) !== JSON.stringify(state.applicationsData)) {
      newState.applicationsData = props.applicationsData;
      newState.applicationsGeoJson = getApplicationTargetGeoJson(getApiResponseResults(props.applicationsData));
    }

    return !isEmpty(newState) ? newState : null;
  }

  getOverlayLayers = () => {
    const layers = [];
    const {
      applicationsGeoJson,
      stateOptions
    } = this.state;
    layers.push({
      checked: true,
      component: <TargetListLayer key='plot_search_targets' color={MAP_COLORS[0]} targetsGeoJson={applicationsGeoJson} stateOptions={stateOptions} />,
      name: 'Kohteet'
    });
    return layers;
  };

  getBounds() {
    const {
      bounds,
      applicationsGeoJson
    } = this.state;
    const {
      location: {
        search
      }
    } = this.props;
    const searchQuery = getUrlParams(search);

    if (searchQuery && searchQuery.search) {
      return getBoundsFromFeatures(applicationsGeoJson);
    } else {
      return bounds;
    }
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
        <AreaNotesEditMap allowToEdit={false} bounds={bounds} center={center} isLoading={isLoading} onViewportChanged={this.handleViewportChanged} overlayLayers={overlayLayers} showZoomLevelWarning={zoom < MAX_ZOOM_LEVEL_TO_FETCH_LEASES} zoom={zoom} zoomLevelWarningText='Tarkenna lähemmäksi kartalla hakeaksesi hakemusten kohteet' />
      </Fragment>;
  }

}

export default (flowRight(withRouter, connect(state => {
  return {
    applicationsData: getApplicationsByBBox(state),
    areaNotes: getAreaNoteList(state),
    usersPermissions: getUsersPermissions(state)
  };
}))(ApplicationListMap) as React.ComponentType<OwnProps>);