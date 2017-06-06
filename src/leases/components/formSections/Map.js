// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
// import {Polygon} from 'react-leaflet';

import MapContainer from '../../../components/map/Map';
import Sidebar from '../../../components/sidebar/Sidebar';
import Control from '../../../components/map/Control';
import MapSidebar from './MapSidebar';

import {defaultCoordinates, defaultZoom} from '../../../constants';
// import {getAreaCoordinates} from '../../../util/helpers';
import {fetchAreas} from '../../actions';
import {connect} from 'react-redux';
import {getAreas} from '../../selectors';

type Props = Object;

type State = {
  displaySidebar: boolean,
};

class Map extends Component {
  props: Props;
  state: State;

  constructor(props) {
    super(props);

    this.state = {
      displaySidebar: false,
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

  render() {
    // const {areas} = this.props;

    return (
      <div className="map">
        <MapContainer center={defaultCoordinates}
                      zoom={defaultZoom}
        >
          <Control className="list-control"
                   position="topright"
                   onClick={this.toggleSidebar}>
            <i className="mi mi-list"/>
          </Control>

          {/*{areas && areas.map((area, i) => {*/}
          {/*return (*/}
          {/*<Polygon key={i} color="blue" positions={getAreaCoordinates(area)}/>*/}
          {/*);*/}
          {/*})}*/}

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
      areas: getAreas(state),
    }), {
      fetchAreas,
    })
)(Map);
