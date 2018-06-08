// @ flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import L from 'leaflet';
import {FeatureGroup} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import 'leaflet-measure-path';
import isEmpty from 'lodash/isEmpty';

import ConfirmationModal from '$components/modal/ConfirmationModal';
import MapContainer from './MapContainer';
import SaveConditionPanel from './SaveConditionPanel';
import {createAreaNote, deleteAreaNote, editAreaNote, hideEditMode} from '$src/areaNote/actions';
import {defaultCoordinates, defaultZoom} from '$src/constants';
import {convertFeaturesToAreaNoteList, getGeometryForDb} from '$src/areaNote/helpers';
import {localizeMap} from '$util/helpers';
import {getInitialAreaNote, getIsEditMode} from '$src/areaNote/selectors';

localizeMap();

const SHAPE_COLOR = '#9c27b0';
const SHAPE_FILL_OPACITY = 0.5;
const SHAPE_ERROR_COLOR = '#bd2719';

type Props = {
  allowEditing?: boolean,
  createAreaNote: Function,
  deleteAreaNote: Function,
  editAreaNote: Function,
  hideEditMode: Function,
  initialValues: Object,
  isEditMode: boolean;
  onHideEdit?: Function,
  showEditTools: boolean,
}

type State = {
  id: number,
  isDeleteModalOpen: boolean,
  isNew: boolean,
  isValid: boolean,
}

class EditableMap extends Component<Props, State> {
  state = {
    id: -1,
    isDeleteModalOpen: false,
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
        geoJSON.features = convertFeaturesToAreaNoteList(geoJSON.features);
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

      // Initialize note field value when opening edit mode
      this.saveConditionPanel.setNoteField(initialValues.note);

      this.setState({
        id: initialValues.id,
        isNew: initialValues.isNew,
      });
    }

    if(!this.props.isEditMode && prevProps.isEditMode) {
      this.featureGroup.leafletElement.eachLayer((layer) => {
        this.featureGroup.leafletElement.removeLayer(layer);
      });
    }
  }

  handleAction = () => {
    this.setState({
      isValid: !!Object.keys(this.featureGroup.leafletElement._layers).length,
    });
  }

  handleCreated = (e: Object) => {
    const {layer} = e;
    layer.showMeasurements();
    this.setState({
      isValid: !!Object.keys(this.featureGroup.leafletElement._layers).length,
    });
  }

  handleCancel = () => {
    const {hideEditMode} = this.props;
    hideEditMode();
  }

  handleSave = (note: string) => {
    const {createAreaNote, editAreaNote} = this.props;
    const {id, isNew} = this.state;

    const features = [];
    this.featureGroup.leafletElement.eachLayer((layer) => features.push(layer.toGeoJSON()));

    const payload = getGeometryForDb(features);
    payload.note = note;

    if(isNew) {
      createAreaNote(payload);
    } else {
      payload.id = id;
      editAreaNote(payload);
    }
  }

  handleDeleteModalOpen = () => {
    this.setState({
      isDeleteModalOpen: true,
    });
  }

  handleDelete = () => {
    const {deleteAreaNote} = this.props;
    const {id} = this.state;

    deleteAreaNote(id);
    this.setState({
      isDeleteModalOpen: false,
    });
  }

  render() {
    const {allowEditing, isEditMode} = this.props;
    const {isDeleteModalOpen, isNew, isValid} = this.state;

    return (
      <div className='map'>
        <ConfirmationModal
          confirmButtonLabel='Poista'
          isOpen={isDeleteModalOpen}
          label='Haluatko varmasti poistaa muistettavan ehdon?'
          onCancel={() => this.setState({isDeleteModalOpen: false})}
          onClose={() => this.setState({isDeleteModalOpen: false})}
          onSave={this.handleDelete}
          title='Poista muistettava ehto'
        />

        <MapContainer
          allowEditing={allowEditing}
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
                  polyline: false,
                  // polyline: {
                  //   allowIntersection: false,
                  //   drawError: {
                  //     color: SHAPE_ERROR_COLOR,
                  //     timeout: 1000,
                  //   },
                  //   shapeOptions: {
                  //     color: SHAPE_COLOR,
                  //     fillOpacity: SHAPE_FILL_OPACITY,
                  //   },
                  // },
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
            ref={(input) => this.saveConditionPanel = input}
            disableDelete={isNew}
            disableSave={!isValid}
            onCancel={this.handleCancel}
            onDelete={this.handleDeleteModalOpen}
            onSave={this.handleSave}
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
      initialValues: getInitialAreaNote(state),
      isEditMode: getIsEditMode(state),
    };
  },
  {
    createAreaNote,
    deleteAreaNote,
    editAreaNote,
    hideEditMode,
  }
)(EditableMap);
