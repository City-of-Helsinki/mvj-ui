import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import differenceWith from 'lodash/differenceWith';
import isEqual from 'lodash/isEqual';
import {Polygon, Tooltip} from 'react-leaflet';

import MapContainer from '../../../components-alpha/map/Map';
import Sidebar from '../../../components-alpha/sidebar/Sidebar';
import Control from '../../../components-alpha/map/Control';
import MapSidebar from './MapSidebar';

import {defaultCoordinates, defaultZoom} from '../../../constants';
import {getAreaCoordinates} from '$util/helpers';
import {fetchAreas} from '../../actions';
import {connect} from 'react-redux';
import {getAreas} from '../../selectors';
import {getFormInitialValues} from 'redux-form';


type Props = Object;
type State = {
  displaySidebar: boolean,
  displayFreeAreas: boolean,
};

class Map extends Component {
  props: Props;
  state: State;

  constructor(props) {
    super(props);

    this.state = {
      displaySidebar: false,
      displayFreeAreas: false,
    };
  }

  componentWillMount() {
    const {fetchAreas} = this.props;
    fetchAreas();
  }

  toggleSidebar = () => {
    const {displaySidebar} = this.state;
    return this.setState({
      displaySidebar: !displaySidebar,
    });
  };

  toggleFreeAreasVisibility = () => {
    const {displayFreeAreas} = this.state;
    return this.setState({
      displayFreeAreas: !displayFreeAreas,
    });
  };

  handleAreaClick = (area) => {
    console.log(area);
  };

  render() {
    const {
      availableAreas,
      initialValues: {areas},
    } = this.props;

    const freeAreas = differenceWith(availableAreas, areas, isEqual);
    const {displayFreeAreas} = this.state;

    return (
      <div className="map">
        <MapContainer center={defaultCoordinates}
          zoom={defaultZoom}
        >
          <Control className="list-control"
            position="topleft"
            title="Näytä listaus"
            onClick={this.toggleSidebar}>
            <i className="mi mi-list"/>
          </Control>

          <Control className="area-control"
            position="topleft"
            title="Näytä kaikki alueet"
            onClick={this.toggleFreeAreasVisibility}>
            <i className="mi mi-layers"/>
          </Control>

          {areas && areas.map((area, i) =>
            <Polygon key={i}
              color="#009246" // $main-blue
              positions={getAreaCoordinates(area)}
              onClick={() => this.handleAreaClick(area)}>
              <Tooltip sticky="true">
                <span>{get(area, 'name')}</span>
              </Tooltip>
            </Polygon>
          )}

          {displayFreeAreas && freeAreas && freeAreas.map((area, i) =>
            <Polygon key={i}
              color="green"
              positions={getAreaCoordinates(area)}
              onClick={() => this.handleAreaClick(area)}>
              <Tooltip sticky="true">
                <span>{get(area, 'name')}</span>
              </Tooltip>
            </Polygon>
          )}

          <Sidebar
            className="map__sidebar"
            isOpen={this.state.displaySidebar}
            component={MapSidebar}
            position="right"
            handleClose={this.toggleSidebar}
          />
        </MapContainer>
      </div>
    );
  }
}

export default flowRight(
  connect(
    (state) => ({
      initialValues: getFormInitialValues('preparer-form')(state),
      availableAreas: getAreas(state),
    }), {
      fetchAreas,
    })
)(Map);
