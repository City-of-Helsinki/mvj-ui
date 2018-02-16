// @flow
import React, {Component} from 'react';
import {FeatureGroup, Polygon, ScaleControl, Tooltip} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import {localizeMap} from '../../util/helpers';
import {defaultCoordinates, defaultZoom} from '../../constants';
import MapContainer from '../../components/map/MapContainer';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';

import SaveConditionPanel from './SaveConditionPanel';

import '../../../node_modules/leaflet-draw/dist/leaflet.draw.css';

localizeMap();

type State = {
  shapes: Array<Object>,
}

class LeaseListMap extends Component {
  state: State = {
    shapes: [],
  }

  handleAreaClick = () => {console.log('polygon clicked!');};

  handleCreated = (e: Object) => {
    const {shapes} = this.state;
    const {layer, layer: {_leaflet_id}} = e;
    shapes.push({
      id: _leaflet_id,
      data: layer.toGeoJSON(),
    });
    this.setState({shapes: shapes});
  }

  handleDeleted = (e: Object) => {
    const {shapes} = this.state;

    const deletedShapes = [];
    e.layers.eachLayer(layer => {
      deletedShapes.push(layer._leaflet_id);
    });

    const newShapes = shapes.filter((shape) => {
      let d = false;
      forEach(deletedShapes, (s) => {
        if(s === shape.id) {
          d = true;
          return false;
        }
      });
      return !d;
    });
    this.setState({shapes: newShapes});
  }

  handleEdited = (e: Object) => {
    const {shapes} = this.state;

    const editedShapes = [];
    e.layers.eachLayer(layer => {
      editedShapes.push({
        id: layer._leaflet_id,
        data: layer.toGeoJSON(),
      });
    });

    const newShapes = shapes.map((shape) => {
      let newShape = {};
      forEach(editedShapes, (s) => {
        if(shape.id === s.id) {
          newShape = s;
          return false;
        }
      });
      if(!isEmpty(newShape)) {
        return newShape;
      }
      return shape;
    });
    this.setState({shapes: newShapes});
  };

  render() {
    const {shapes} = this.state;

    return (
      <div className='map'>
        <MapContainer center={defaultCoordinates}
          zoom={defaultZoom}>
          <FeatureGroup>
            <EditControl
              position='topright'
              onCreated={this.handleCreated}
              onDeleted={this.handleDeleted}
              onEdited={this.handleEdited}
              draw={{
                circlemarker: false,
                marker: false,
                polyline: true,
              }}
            />
          </FeatureGroup>
          <SaveConditionPanel show={shapes && !!shapes.length} />

          <ScaleControl imperial={false} />

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
        </MapContainer>
      </div>
    );
  }
}

export default LeaseListMap;
