// @ flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import L from 'leaflet';
import {FeatureGroup} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import 'leaflet-measure-path';
import isEmpty from 'lodash/isEmpty';

import MapContainer from '$components/map/MapContainer';
import SaveConditionPanel from './SaveConditionPanel';
import {createRememberableTerm, deleteRememberableTerm, editRememberableTerm} from '$src/rememberableTerms/actions';
import {defaultCoordinates, defaultZoom} from '$src/constants';
import {convertFeaturesToRememberableTermList, convertRememberableTermListToFeatures} from '$src/rememberableTerms/helpers';
import {localizeMap} from '$util/helpers';
import {hideEditMode} from '$src/rememberableTerms/actions';
import {getInitialRememberableTerm, getIsEditMode} from '$src/rememberableTerms/selectors';

localizeMap();

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
          this.featureGroup.leafletElement.addLayer(layer);
        });
        this.setState({isValid: true});
      } else {
        this.setState({isValid: false});
      }

      // Initialize comment field value when opening edit isEditMode
      console.log(initialValues.comment);
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

    const features = [];
    this.featureGroup.leafletElement.eachLayer((layer) => features.push(layer.toGeoJSON()));
    // Inject comment to the Feature properties if comment exists
    if(comment) {
      features.forEach((feature) => feature.properties.comment = comment);
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
                onCreated={this.handleAction}
                onDeleted={this.handleAction}
                onEdited={this.handleAction}
                draw={{
                  circlemarker: false,
                  circle: false,
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
            disableDelete={isNew}
            disableSave={!isValid}
            onCancel={this.handleCancel}
            onDelete={this.handleDelete}
            onSave={(comment) => this.handleSave(comment)}
            show={isEditMode}
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
