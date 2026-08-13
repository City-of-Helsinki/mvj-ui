import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import L from "leaflet";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet-measure-path";
import { isEmpty, throttle } from "lodash-es";
import MapContainer from "./MapContainer";
import SaveConditionPanel, {
  type SaveConditionPanelHandle,
} from "./SaveConditionPanel";
import ZoomLevelWarning from "./ZoomLevelWarning";
import {
  createAreaNote,
  deleteAreaNote,
  editAreaNote,
  hideEditMode,
} from "@/areaNote/actions";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/util/constants";
import { convertFeatureCollectionToFeature } from "@/areaNote/helpers";
import { localizeMap } from "@/util/map";
import { getInitialAreaNote, getIsEditMode } from "@/areaNote/selectors";

localizeMap();

const SHAPE_COLOR = "#9c27b0";
const SHAPE_FILL_OPACITY = 0.5;
const SHAPE_ERROR_COLOR = "#bd2719";

type Props = {
  allowToEdit: boolean;
  bounds?: Record<string, any>;
  center?: Array<number>;
  isLoading?: boolean;
  onMapDidMount?: (...args: Array<any>) => any;
  onViewportChanged?: (...args: Array<any>) => any;
  overlayLayers?: Array<Record<string, any>>;
  showZoomLevelWarning?: boolean;
  zoom?: number;
  zoomLevelWarningText?: string;
};

const AreaNotesEditMap: React.FC<Props> = ({
  allowToEdit,
  bounds,
  center,
  isLoading,
  onMapDidMount,
  onViewportChanged,
  overlayLayers,
  showZoomLevelWarning,
  zoom,
  zoomLevelWarningText,
}) => {
  const dispatch = useDispatch();
  const initialValues = useSelector(getInitialAreaNote);
  const isEditMode = useSelector(getIsEditMode);

  const featureGroupRef = useRef<Record<string, any> | null>(null);
  const saveConditionPanelRef = useRef<SaveConditionPanelHandle | null>(null);
  const previousIsEditModeRef = useRef(isEditMode);

  const [id, setId] = useState<number>(-1);
  const [isNew, setIsNew] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const getLayerCount = useCallback(() => {
    if (!featureGroupRef.current) {
      return 0;
    }

    return Object.keys(featureGroupRef.current.leafletElement._layers).length;
  }, []);

  useEffect(() => {
    if (isEditMode && !previousIsEditModeRef.current) {
      const geoJSON = { ...initialValues.geoJSON };

      if (!isEmpty(geoJSON)) {
        const featuresGeoJSON = new L.GeoJSON(geoJSON);
        featuresGeoJSON.eachLayer((layer) => {
          if (
            layer instanceof L.Polyline ||
            layer instanceof L.Polygon ||
            layer instanceof L.Circle
          ) {
            layer.setStyle({
              color: SHAPE_COLOR,
              fillOpacity: SHAPE_FILL_OPACITY,
            });
            featureGroupRef.current?.leafletElement.addLayer(layer);
            layer.showMeasurements();
          }
        });
        setIsValid(true);
      } else {
        setIsValid(false);
      }

      saveConditionPanelRef.current?.setNoteField(initialValues.note);
      setId(initialValues.id);
      setIsNew(initialValues.isNew);
    }

    if (!isEditMode && previousIsEditModeRef.current) {
      featureGroupRef.current?.leafletElement.eachLayer((layer) => {
        featureGroupRef.current?.leafletElement.removeLayer(layer);
      });
    }

    previousIsEditModeRef.current = isEditMode;
  }, [initialValues, isEditMode]);

  const updateAllFeatures = useMemo(
    () =>
      throttle(
        () => {
          featureGroupRef.current?.leafletElement?.eachLayer((layer) => {
            layer.showMeasurements();
            layer.updateMeasurements();
          });
        },
        1000 / 60,
        {
          leading: true,
          trailing: true,
        },
      ),
    [],
  );

  useEffect(() => {
    return () => {
      updateAllFeatures.cancel();
    };
  }, [updateAllFeatures]);

  const handleAction = useCallback(() => {
    setIsValid(getLayerCount() > 0);
  }, [getLayerCount]);

  const handleCreated = useCallback(
    (e: Record<string, any>) => {
      const { layer } = e;
      layer.showMeasurements();
      setIsValid(getLayerCount() > 0);
    },
    [getLayerCount],
  );

  const handleNonCommittedChange = useCallback(() => {
    updateAllFeatures();
  }, [updateAllFeatures]);

  const cancelChanges = useCallback(() => {
    dispatch(hideEditMode());
  }, [dispatch]);

  const handleCreate = useCallback(
    (note: string) => {
      const features: Array<Record<string, any>> = [];
      featureGroupRef.current?.leafletElement.eachLayer((layer) =>
        features.push(layer.toGeoJSON()),
      );

      const payload = convertFeatureCollectionToFeature(features);
      payload.note = note;
      dispatch(createAreaNote(payload));
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (note: string) => {
      const features: Array<Record<string, any>> = [];
      featureGroupRef.current?.leafletElement.eachLayer((layer) =>
        features.push(layer.toGeoJSON()),
      );

      const payload = convertFeatureCollectionToFeature(features);
      payload.note = note;
      payload.id = id;
      dispatch(editAreaNote(payload));
    },
    [dispatch, id],
  );

  const handleDelete = useCallback(() => {
    dispatch(deleteAreaNote(id));
  }, [dispatch, id]);

  return (
    <div className="map">
      <MapContainer
        bounds={bounds}
        center={center || DEFAULT_CENTER}
        isLoading={isLoading}
        onMapDidMount={onMapDidMount}
        onViewportChanged={onViewportChanged}
        overlayLayers={overlayLayers}
        zoom={zoom || DEFAULT_ZOOM}
      >
        <FeatureGroup
          ref={(el) => {
            featureGroupRef.current = el;
          }}
        >
          {allowToEdit && isEditMode && (
            <EditControl
              position="topright"
              onCreated={handleCreated}
              onDeleted={handleAction}
              onEdited={handleAction}
              onEditMove={handleNonCommittedChange}
              onEditVertex={handleNonCommittedChange}
              onEditStop={handleNonCommittedChange}
              onDeleteStop={handleNonCommittedChange}
              draw={{
                circlemarker: false,
                circle: false,
                marker: false,
                polyline: false,
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
          )}
        </FeatureGroup>

        {allowToEdit && (
          <SaveConditionPanel
            ref={saveConditionPanelRef}
            disableDelete={isNew}
            disableSave={!isValid}
            isNew={isNew}
            onCancel={cancelChanges}
            onCreate={handleCreate}
            onDelete={handleDelete}
            onEdit={handleEdit}
            show={isEditMode}
          />
        )}

        {zoomLevelWarningText && (
          <ZoomLevelWarning
            isOpen={showZoomLevelWarning || false}
            text={zoomLevelWarningText}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default AreaNotesEditMap;
