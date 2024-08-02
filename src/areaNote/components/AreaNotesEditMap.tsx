import React, { Component } from "react";
import { connect } from "react-redux";
import L from "leaflet";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet-measure-path";
import isEmpty from "lodash/isEmpty";
import throttle from "lodash/throttle";
import MapContainer from "./MapContainer";
import SaveConditionPanel from "./SaveConditionPanel";
import ZoomLevelWarning from "./ZoomLevelWarning";
import { createAreaNote, deleteAreaNote, editAreaNote, hideEditMode } from "areaNote/actions";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "util/constants";
import { convertFeatureCollectionToFeature } from "areaNote/helpers";
import { localizeMap } from "util/map";
import { getInitialAreaNote, getIsEditMode } from "areaNote/selectors";
localizeMap();
const SHAPE_COLOR = '#9c27b0';
const SHAPE_FILL_OPACITY = 0.5;
const SHAPE_ERROR_COLOR = '#bd2719';
type OwnProps = {
  allowToEdit: boolean;
  bounds?: Record<string, any>;
  center?: Array<number>;
  isLoading?: boolean;
  onHideEdit?: (...args: Array<any>) => any;
  onMapDidMount?: (...args: Array<any>) => any;
  onViewportChanged?: (...args: Array<any>) => any;
  overlayLayers?: Array<Record<string, any>>;
  showZoomLevelWarning?: boolean;
  zoom?: number;
  zoomLevelWarningText?: string;
};
type Props = OwnProps & {
  createAreaNote: (...args: Array<any>) => any;
  deleteAreaNote: (...args: Array<any>) => any;
  editAreaNote: (...args: Array<any>) => any;
  hideEditMode: (...args: Array<any>) => any;
  initialValues: Record<string, any>;
  isEditMode: boolean;
};
type State = {
  id: number;
  isNew: boolean;
  isValid: boolean;
};

class AreaNotesEditMap extends Component<Props, State> {
  featureGroup: Record<string, any> | null | undefined;
  saveConditionPanel: Record<string, any> | null | undefined;
  state: State = {
    id: -1,
    isNew: true,
    isValid: false
  };
  setFeatureGroupRef = (el: Record<string, any> | null | undefined) => {
    this.featureGroup = el;
  };
  setSaveConditionPanelRef = (el: Record<string, any> | null | undefined) => {
    this.saveConditionPanel = el;
  };

  componentDidUpdate(prevProps) {
    if (this.props.isEditMode && !prevProps.isEditMode) {
      const {
        initialValues
      } = this.props;
      // Initialize select features for editing
      const geoJSON = { ...initialValues.geoJSON
      };

      if (!isEmpty(geoJSON)) {
        const featuresGeoJSON = new L.GeoJSON(geoJSON);
        featuresGeoJSON.eachLayer((layer) => {
          if (layer instanceof L.Polyline || layer instanceof L.Polygon || layer instanceof L.Circle) {
            layer.setStyle({
              "color": SHAPE_COLOR,
              "fillOpacity": SHAPE_FILL_OPACITY}
            );
            this.featureGroup?.leafletElement.addLayer(layer);
            layer.showMeasurements();
          }

        });
        this.setState({
          isValid: true
        });
      } else {
        this.setState({
          isValid: false
        });
      }

      // Initialize note field value when opening edit mode
      this.saveConditionPanel?.setNoteField(initialValues.note);
      this.setState({
        id: initialValues.id,
        isNew: initialValues.isNew
      });
    }

    if (!this.props.isEditMode && prevProps.isEditMode) {
      this.featureGroup?.leafletElement.eachLayer(layer => {
        this.featureGroup?.leafletElement.removeLayer(layer);
      });
    }
  }

  updateAllFeatures = throttle(() => {
    this.featureGroup?.leafletElement?.eachLayer(layer => {
      layer.showMeasurements();
      layer.updateMeasurements();
    });
  }, 1000 / 60, {
    leading: true,
    trailing: true
  });
  handleAction = () => {
    this.setState({
      isValid: !!this.featureGroup && !!Object.keys(this.featureGroup.leafletElement._layers).length
    });
  };
  handleCreated = (e: Record<string, any>) => {
    const {
      layer
    } = e;
    layer.showMeasurements();
    this.setState({
      isValid: !!this.featureGroup && !!Object.keys(this.featureGroup.leafletElement._layers).length
    });
  };
  handleNonCommittedChange = () => {
    this.updateAllFeatures();
  };
  cancelChanges = () => {
    const {
      hideEditMode
    } = this.props;
    hideEditMode();
  };
  handleCreate = (note: string) => {
    const {
      createAreaNote
    } = this.props;
    const features = [];
    this.featureGroup?.leafletElement.eachLayer(layer => features.push(layer.toGeoJSON()));
    const payload = convertFeatureCollectionToFeature(features);
    payload.note = note;
    createAreaNote(payload);
  };
  handleEdit = (note: string) => {
    const {
      editAreaNote
    } = this.props;
    const {
      id
    } = this.state;
    const features = [];
    this.featureGroup?.leafletElement.eachLayer(layer => features.push(layer.toGeoJSON()));
    const payload = convertFeatureCollectionToFeature(features);
    payload.note = note;
    payload.id = id;
    editAreaNote(payload);
  };
  deleteAreaNote = () => {
    const {
      deleteAreaNote
    } = this.props;
    const {
      id
    } = this.state;
    deleteAreaNote(id);
  };

  render() {
    const {
      allowToEdit,
      bounds,
      center,
      isEditMode,
      isLoading,
      onMapDidMount,
      onViewportChanged,
      overlayLayers,
      showZoomLevelWarning,
      zoom,
      zoomLevelWarningText
    } = this.props;
    const {
      isNew,
      isValid
    } = this.state;
    return <div className='map'>
        <MapContainer bounds={bounds} center={center ? center : DEFAULT_CENTER} isLoading={isLoading} onMapDidMount={onMapDidMount} onViewportChanged={onViewportChanged} overlayLayers={overlayLayers} zoom={zoom || DEFAULT_ZOOM}>
          <FeatureGroup ref={this.setFeatureGroupRef}>
            {allowToEdit && isEditMode && <EditControl position='topright' onCreated={this.handleCreated} onDeleted={this.handleAction} onEdited={this.handleAction} onEditMove={this.handleNonCommittedChange} onEditVertex={this.handleNonCommittedChange} onEditStop={this.handleNonCommittedChange} onDeleteStop={this.handleNonCommittedChange} draw={{
            circlemarker: false,
            circle: false,
            marker: false,
            polyline: false,
            polygon: {
              allowIntersection: false,
              showArea: true,
              drawError: {
                color: SHAPE_ERROR_COLOR,
                timeout: 1000
              },
              shapeOptions: {
                color: SHAPE_COLOR,
                fillOpacity: SHAPE_FILL_OPACITY
              }
            },
            rectangle: {
              shapeOptions: {
                color: SHAPE_COLOR,
                fillOpacity: SHAPE_FILL_OPACITY
              }
            }
          }} />}
          </FeatureGroup>

          {allowToEdit && <SaveConditionPanel ref={this.setSaveConditionPanelRef} disableDelete={isNew} disableSave={!isValid} isNew={isNew} onCancel={this.cancelChanges} onCreate={this.handleCreate} onDelete={this.deleteAreaNote} onEdit={this.handleEdit} show={isEditMode} />}

          {zoomLevelWarningText && <ZoomLevelWarning isOpen={showZoomLevelWarning || false} text={zoomLevelWarningText} />}
        </MapContainer>
      </div>;
  }

}

export default (connect(state => {
  return {
    initialValues: getInitialAreaNote(state),
    isEditMode: getIsEditMode(state)
  };
}, {
  createAreaNote,
  deleteAreaNote,
  editAreaNote,
  hideEditMode
})(AreaNotesEditMap) as React.ComponentType<OwnProps>);