// @ flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import L from 'leaflet';
import {FeatureGroup} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import 'leaflet-measure-path';
import isEmpty from 'lodash/isEmpty';

import MapContainer from './MapContainer';
import SaveConditionPanel from './SaveConditionPanel';
import {createRememberableTerm, deleteRememberableTerm, editRememberableTerm} from '$src/rememberableTerms/actions';
import {defaultCoordinates, defaultZoom} from '$src/constants';
import {convertFeaturesToRememberableTermList, convertRememberableTermListToFeatures} from '$src/rememberableTerms/helpers';
import {localizeMap} from '$util/helpers';
import {hideEditMode} from '$src/rememberableTerms/actions';
import {getInitialRememberableTerm, getIsEditMode} from '$src/rememberableTerms/selectors';

localizeMap();

const SHAPE_COLOR = '#9c27b0';
const SHAPE_FILL_OPACITY = 0.5;
const SHAPE_ERROR_COLOR = '#bd2719';

type Props = {
  createRememberableTerm: Function,
  deleteRememberableTerm: Function,
  editRememberableTerm: Function,
  hideEditMode: Function,
  initialValues: Object,
  isEditMode: boolean;
  onHideEdit?: Function,
  showEditTools: boolean,
}

type State = {
  id: number,
  isNew: boolean,
  isValid: boolean,
}

class EditableMap extends Component<Props, State> {
  state = {
    id: -1,
    isNew: true,
    isValid: false,
  }

  saveConditionPanel: any
  featureGroup: any

  componentDidUpdate(prevProps) {
    if(this.props.isEditMode && !prevProps.isEditMode) {
      const {initialValues} = this.props;

      // Initialize select features for editing
      const geoJSON = {...initialValues.geoJSON};
      if(!isEmpty(geoJSON)) {
        geoJSON.features = convertFeaturesToRememberableTermList(geoJSON.features);
        const featuresGeoJSON = new L.GeoJSON(geoJSON);
        featuresGeoJSON.eachLayer( (layer) => {
          layer.options.color = SHAPE_COLOR;
          layer.options.fillOpacity = SHAPE_FILL_OPACITY;
          this.featureGroup.leafletElement.addLayer(layer);
          layer.showMeasurements();
        });
        this.setState({isValid: true});
      } else {
        this.setState({isValid: false});
      }

      // Initialize comment field value when opening edit isEditMode
      this.saveConditionPanel.setCommentField(initialValues.comment);

      this.setState({id: initialValues.id});
      this.setState({isNew: initialValues.isNew});
    }

    if(!this.props.isEditMode && prevProps.isEditMode) {
      this.featureGroup.leafletElement.eachLayer((layer) => {
        this.featureGroup.leafletElement.removeLayer(layer);
      });
    }
  }

  handleAction = () => {
    let amount = 0;
    this.featureGroup.leafletElement.eachLayer(() => amount++);
    this.setState({isValid: !!amount});
  }

  handleCreated = (e: Object) => {
    const {layer} = e;
    layer.showMeasurements();

    let amount = 0;
    this.featureGroup.leafletElement.eachLayer(() => amount++);
    this.setState({isValid: !!amount});

  }

  handleCancel = () => {
    const {hideEditMode} = this.props;
    hideEditMode();
  }

  handleSave = (comment: string) => {
    const {isNew} = this.state;

    if(isNew) {
      this.handleCreate(comment);
    } else {
      this.handleEdit(comment);
    }
  }

  handleCreate = (comment: string) => {
    const {createRememberableTerm} = this.props;

    const features = [];
    this.featureGroup.leafletElement.eachLayer((layer) => features.push(layer.toGeoJSON()));
    // Inject comment to the Feature properties if comment exists
    if(comment) {
      features.forEach((feature) => feature.properties.comment = comment);
    }

    createRememberableTerm(convertRememberableTermListToFeatures(features));
  }

  handleEdit = (comment: string) => {
    const {editRememberableTerm} = this.props;
    const {id} = this.state;

    const features = [];
    this.featureGroup.leafletElement.eachLayer((layer) => features.push(layer.toGeoJSON()));
    // Inject comment to the Feature properties if comment exists
    if(comment) {
      features.forEach((feature) => {
        feature.properties.comment = comment;
        feature.properties.id = id;
      });
    }

    editRememberableTerm(convertRememberableTermListToFeatures(features));
  }

  handleDelete = () => {
    this.props.deleteRememberableTerm(this.state.id);
  }

  render() {
    const {isEditMode} = this.props;
    const {isNew, isValid} = this.state;

    return (
      <div className='map'>
        <MapContainer
          center={defaultCoordinates}
          zoom={defaultZoom}
        >
          <FeatureGroup
            ref={(input) => {this.featureGroup = input;}}
          >
            {isEditMode &&
              <EditControl
                position='topright'
                onCreated={this.handleCreated}
                onDeleted={this.handleAction}
                onEdited={this.handleAction}
                draw={{
                  circlemarker: false,
                  circle: false,
                  marker: false,
                  polyline: {
                    allowIntersection: false,
                    drawError: {
                      color: SHAPE_ERROR_COLOR,
                      timeout: 1000,
                    },
                    shapeOptions: {
                      color: SHAPE_COLOR,
                      fillOpacity: SHAPE_FILL_OPACITY,
                    },
                  },
                  polygon: {
                    allowIntersection: false,
                    showArea: true,
                    drawError: {
                      color: SHAPE_ERROR_COLOR,
                      timeout: 1000,
                    },
                    shapeOptions: {
                      color: SHAPE_COLOR,
                      fillOpacity: SHAPE_FILL_OPACITY,
                    },
                  },
                  rectangle: {
                    shapeOptions: {
                      color: SHAPE_COLOR,
                      fillOpacity: SHAPE_FILL_OPACITY,
                    },
                  },
                }}
              />
            }
          </FeatureGroup>
          <SaveConditionPanel
            ref={(input) => {this.saveConditionPanel = input;}}
            disableDelete={isNew}
            disableSave={!isValid}
            onCancel={this.handleCancel}
            onDelete={this.handleDelete}
            onSave={(comment) => this.handleSave(comment)}
            show={isEditMode}
            title={isEditMode ? 'Muokkaa muistettavaa ehtoa' : 'Luo muistettava ehto'}
          />
        </MapContainer>
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      initialValues: getInitialRememberableTerm(state),
      isEditMode: getIsEditMode(state),
    };
  },
  {
    createRememberableTerm,
    deleteRememberableTerm,
    editRememberableTerm,
    hideEditMode,
  }
)(EditableMap);
