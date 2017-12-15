import React, {Component} from 'react';
import {Polygon, Tooltip} from 'react-leaflet';
import MapContainer from '../../components/map/Map';
import {defaultCoordinates, defaultZoom} from '../../constants';

type Props = {
  mockData: Array<Object>,
}

class Map extends Component {
  props: Props

  handleAreaClick = () => {
    console.log('polygon clicked!');
  };

  render() {
    console.log(this.props.mockData);
    return (
      <div className='map'>
        <MapContainer center={defaultCoordinates}
          zoom={defaultZoom}
        >

          <Polygon
            color="#009246" // tram green
            positions={[
              [60.19, 24.924],
              [60.19, 24.926],
              [60.194, 24.929],
              [60.196, 24.924],
            ]}
            onClick={() => this.handleAreaClick()}
          >
            <Tooltip sticky="true">
              <span>teksti tähän!</span>
            </Tooltip>
          </Polygon>
        </MapContainer>
      </div>
    );
  }
}

export default Map;
