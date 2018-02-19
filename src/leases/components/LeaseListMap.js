// @ flow
import React, {Component} from 'react';
import {FeatureGroup} from 'react-leaflet';
// import PolygonWithMeasurements from '../../components/leaflet/PolygonWithMeasurements';
import {EditControl} from 'react-leaflet-draw';
import {localizeMap} from '../../util/helpers';
import {defaultCoordinates, defaultZoom} from '../../constants';
import MapContainer from '../../components/map/MapContainer';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';

import SaveConditionPanel from './SaveConditionPanel';

import '../../../node_modules/leaflet-draw/dist/leaflet.draw.css';

import mockData from '../../components/map/mock-data-map.json';

localizeMap();

type State = {
  rememberableTerms: Array<Object>,
  shapes: Array<Object>,
}

class LeaseListMap extends Component {
  state: State = {
    shapes: [],
  }

  componentWillMount() {
    this.setState({rememberableTerms: mockData});
  }

  handleAreaClick = () => {console.log('polygon clicked!');};

  handleCreated = (e: Object) => {
    const {shapes} = this.state;
    const {layer, layer: {_leaflet_id}, layerType} = e;

    let geoJSON = layer.toGeoJSON();
    if(layerType === 'circle') {
      const radius = layer.getRadius();
      geoJSON.properties.radius = radius;
    }
    shapes.push({
      id: _leaflet_id,
      data: geoJSON,
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
      console.log(layer);
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
    const {rememberableTerms, shapes} = this.state;
    console.log(shapes);

    return (
      <div className='map'>
        <MapContainer
          center={defaultCoordinates}
          rememberableTerms={rememberableTerms}
          zoom={defaultZoom}
          >
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
        </MapContainer>
      </div>
    );
  }
}

export default LeaseListMap;