// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import AreaNotesEditMap from '$src/areaNote/components/AreaNotesEditMap';
import {DEFAULT_ZOOM, MAP_COLORS} from '$src/constants';
import {
  getApiResponseResults,
  getUrlParams,
} from '$util/helpers';
import {getBoundsFromBBox, getBoundsFromFeatures} from '$util/map';
import {getAreaNoteList} from '$src/areaNote/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import AreaSearchLayer from '$src/areaSearch/components/map/AreaSearchLayer';
import {getAreaSearchListByBBox} from '$src/areaSearch/selectors';
import {getAreaSearchGeoJson} from '$src/areaSearch/helpers';
import {MAX_ZOOM_LEVEL_TO_FETCH_AREA_SEARCHES} from '$src/areaSearch/constants';

import type {ApiResponse, LeafletGeoJson} from '$src/types';
import type {AreaNoteList} from '$src/areaNote/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

const getMapBounds = () => {
  const {search} = location;
  const searchQuery = getUrlParams(search);

  return getBoundsFromBBox(searchQuery.in_bbox);
};

const getMapCenter = () => {
  const bounds = getMapBounds();

  return bounds ? bounds.getCenter() : null;
};

const getMapZoom = () => {
  const {search} = location;
  const searchQuery = getUrlParams(search);

  return searchQuery.zoom || DEFAULT_ZOOM;
};

type OwnProps = {
  allowToEdit: boolean,
  isLoading: boolean,
  onViewportChanged: Function,
};

type Props = {
  ...OwnProps,
  areaNotes: AreaNoteList,
  searchData: ApiResponse,
  location: Object,
  usersPermissions: UsersPermissionsType,
}

type State = {
  bounds: ?Object,
  center: ?Object,
  searchData: ApiResponse,
  searchGeoJson: LeafletGeoJson,
  stateOptions: Array<Object>,
  zoom: number,
}

class AreaSearchListMap extends PureComponent<Props, State> {
  state = {
    bounds: getMapBounds(),
    center: getMapCenter(),
    searchData: null,
    searchGeoJson: {
      features: [],
      type: 'FeatureCollection',
    },
    stateOptions: [],
    zoom: getMapZoom(),
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if (JSON.stringify(props.searchData) !== JSON.stringify(state.searchData)) {
      newState.searchData = props.searchData;
      newState.searchGeoJson = getAreaSearchGeoJson(getApiResponseResults(props.searchData) || []);
    }

    return !isEmpty(newState) ? newState : null;
  }

  getOverlayLayers = () => {
    const layers = [];
    const {searchGeoJson, stateOptions} = this.state;

    layers.push({
      checked: true,
      component: <AreaSearchLayer
        key='plot_search_targets'
        color={MAP_COLORS[0]}
        areaSearchesGeoJson={searchGeoJson}
        stateOptions={stateOptions}
      />,
      name: 'Kohteet',
    });

    return layers;
  }

  getBounds() {
    const {bounds, searchGeoJson} = this.state;
    const {location: {search}} = this.props;
    const searchQuery = getUrlParams(search);

    if (searchQuery && searchQuery.search) {
      return getBoundsFromFeatures(searchGeoJson);
    } else {
      return bounds;
    }
  }

  handleViewportChanged = (mapOptions: Object) => {
    const {onViewportChanged} = this.props;
    this.setState({zoom: mapOptions.zoom});

    onViewportChanged(mapOptions);
  }


  render() {
    const {isLoading} = this.props;
    const {center, zoom} = this.state;
    const overlayLayers = this.getOverlayLayers();
    const bounds = this.getBounds();

    return(
      <Fragment>
        <AreaNotesEditMap
          allowToEdit={false}
          bounds={bounds}
          center={center || undefined}
          isLoading={isLoading}
          onViewportChanged={this.handleViewportChanged}
          overlayLayers={overlayLayers}
          showZoomLevelWarning={zoom < MAX_ZOOM_LEVEL_TO_FETCH_AREA_SEARCHES}
          zoom={zoom}
          zoomLevelWarningText='Tarkenna lähemmäksi kartalla hakeaksesi hakemusten kohteet'
        />
      </Fragment>
    );
  }
}

export default (flowRight(
  withRouter,
  connect(
    (state) => {
      return {
        searchData: getAreaSearchListByBBox(state),
        areaNotes: getAreaNoteList(state),
        usersPermissions: getUsersPermissions(state),
      };
    },
  ),
)(AreaSearchListMap): React$ComponentType<OwnProps>);
