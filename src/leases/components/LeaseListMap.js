// @ flow
import React, {Component} from 'react';
import {FeatureGroup} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import {localizeMap} from '../../util/helpers';
import {defaultCoordinates, defaultZoom} from '../../constants';
import MapContainer from '../../components/map/MapContainer';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import 'leaflet-measure-path';

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
    rememberableTerms: [],
    shapes: [],
  }

  componentWillMount() {
    this.setState({rememberableTerms: mockData});
  }

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

    layer.showMeasurements();
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

  createRememberableTerm = (comment: string) => {
    const {rememberableTerms, shapes} = this.state;

    shapes.forEach((shape) => {
      if(comment) {
        shape.data.properties.comment = comment;
      }
      rememberableTerms.push(shape.data);
      // Delete layers after pushing them to array.
      // TODO: Find better place for this when saving using API is ready
      this.featureGroup.leafletElement.removeLayer(shape.id);
    });
    this.setState({rememberableTerms: rememberableTerms, shapes: []});
    this.saveConditionPanel.clearCommentField();
  }

  render() {
    const {rememberableTerms, shapes} = this.state;

    return (
      <div className='map'>
        <MapContainer
          center={defaultCoordinates}
          rememberableTerms={rememberableTerms}
          zoom={defaultZoom}
          >
          <FeatureGroup
            ref={(input) => {this.featureGroup = input;}}
          >
            <EditControl
              position='topright'
              onCreated={this.handleCreated}
              onDeleted={this.handleDeleted}
              onEdited={this.handleEdited}
              draw={{
                circlemarker: false,
                marker: false,
                polyline: {
                  allowIntersection: false,
                  drawError: {
                    color: '#b00b00',
                    timeout: 1000,
                  },
                },
                polygon: {
                  allowIntersection: false,
                  showArea: true,
                  drawError: {
                    color: '#b00b00',
                    timeout: 1000,
                  },
                },
              }}
            />
          </FeatureGroup>
          <SaveConditionPanel
            ref={(input) => {this.saveConditionPanel = input;}}
            createCondition={(comment) => this.createRememberableTerm(comment)} show={shapes && !!shapes.length} />
        </MapContainer>
      </div>
    );
  }
}

export default LeaseListMap;
