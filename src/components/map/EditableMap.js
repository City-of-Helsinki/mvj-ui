// @ flow
import React, {Component} from 'react';
import {FeatureGroup} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import 'leaflet-measure-path';

import {displayUIMessage, localizeMap} from '$util/helpers';
import {defaultCoordinates, defaultZoom} from '$src/constants';
import MapContainer from '$components/map/MapContainer';
import SaveConditionPanel from './SaveConditionPanel';

import type {RememberableTermList} from '$src/rememberableTerms/types';

localizeMap();

type Props = {
  onHideEdit?: Function,
  rememberableTerms?: RememberableTermList,
  showEditTools: boolean,
}

type State = {
  rememberableTerms: Array<Object>,
  shapes: Array<Object>,
}

class EditableMap extends Component<Props, State> {
  static defaultProps = {
    rememberableTerms: [],
  };

  state = {
    shapes: [],
  }

  saveConditionPanel: any
  featureGroup: any

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
    const {onHideEdit} = this.props;
    const {
      // rememberableTerms,
      shapes,
    } = this.state;

    shapes.forEach((shape) => {
      if(comment) {
        shape.data.properties.comment = comment;
      }
      // rememberableTerms.push(shape.data);
      // Delete layers after pushing them to array.
      // TODO: Find better place for this when saving using API is ready
      this.featureGroup.leafletElement.removeLayer(shape.id);
    });

    this.setState({
      // rememberableTerms: rememberableTerms,
      shapes: [],
    });

    this.saveConditionPanel.clearCommentField();
    displayUIMessage({title: 'Muistettava ehto tallennettu', body: 'Muistettava ehto on tallennettu onnistuneesti'});

    if(onHideEdit) {
      onHideEdit();
    }
  }

  handleCancel = () => {
    const {onHideEdit} = this.props;
    const {shapes} = this.state;

    shapes.forEach((shape) => {
      this.featureGroup.leafletElement.removeLayer(shape.id);
    });

    this.setState({
      shapes: [],
    });

    this.saveConditionPanel.clearCommentField();

    if(onHideEdit) {
      onHideEdit();
    }
  }

  render() {
    const {rememberableTerms, showEditTools} = this.props;
    const {shapes} = this.state;

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
            {showEditTools &&
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
            }

          </FeatureGroup>
          <SaveConditionPanel
            ref={(input) => {this.saveConditionPanel = input;}}
            createCondition={(comment) => this.createRememberableTerm(comment)}
            disableSave={!shapes || !shapes.length}
            onCancel={this.handleCancel}
            show={showEditTools}
          />
        </MapContainer>
      </div>
    );
  }
}

export default EditableMap;
