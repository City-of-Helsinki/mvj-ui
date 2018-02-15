import React, {Component} from 'react';
import {FeatureGroup, Polygon, ScaleControl, Tooltip} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';

import {localizeMap} from '../../util/helpers';
import {defaultCoordinates, defaultZoom} from '../../constants';
import MapContainer from '../../components/map/Map';

import '../../../node_modules/leaflet-draw/dist/leaflet.draw.css';

localizeMap();

class LeaseListMap extends Component {
  handleAreaClick = () => {console.log('polygon clicked!');};

  render() {
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
            <Tooltip sticky="true"><span>teksti tähän!</span></Tooltip>
          </Polygon>
          <FeatureGroup>
            <EditControl
              position='topright'
              draw={{
                circlemarker: false,
                marker: false,
                polyline: false,
              }}
            />
          </FeatureGroup>
          <ScaleControl imperial={false} />
        </MapContainer>
      </div>
    );
  }
}

export default LeaseListMap;
