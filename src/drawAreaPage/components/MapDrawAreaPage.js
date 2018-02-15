import React, {Component} from 'react';
import {Polygon, Tooltip, ScaleControl} from 'react-leaflet';

import {defaultCoordinates, defaultZoom} from '../../constants';
import MapContainer from '../../components/map/MapContainer';

type Props = {
  areas: Array<Object>,
}

class MapDrawAreaPage extends Component {
  props: Props

  handleAreaClick = () => {
    console.log('polygon clicked!');
  };

  render() {
    return (
      <div className='map'>
        <MapContainer center={defaultCoordinates}
          zoom={defaultZoom}
        >
          <ScaleControl imperial={false} />
          <Polygon
            color="#009246" // tram green
            positions={[
              [60.19, 24.924],
              [60.19, 24.926],
              [60.194, 24.929],
              [60.196, 24.924],
            ]}
            onClick={() => this.handleAreaClick()}>
            <Tooltip sticky="true"><span>teksti tähän!</span></Tooltip>
          </Polygon>
        </MapContainer>
      </div>
    );
  }
}

export default MapDrawAreaPage;
