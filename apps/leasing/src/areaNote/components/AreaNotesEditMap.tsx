import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import L from "leaflet";
import { isEmpty, throttle } from "lodash-es";
import MapContainer from "./MapContainer";
import LeafletDrawControl, {
  DRAFT_DRAW_OPTIONS,
} from "@/components/map/LeafletDrawControl";
import SaveConditionPanel, {
  type SaveConditionPanelHandle,
} from "./SaveConditionPanel";
import ZoomLevelWarning from "./ZoomLevelWarning";
import {
  createAreaNote,
  deleteAreaNote,
  editAreaNote,
  hideEditMode,
} from "@/areaNote/slice";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/util/constants";
import { convertDrawnFeaturesToAreaNotePayload } from "@/areaNote/helpers";
import type {
  DrawnPolygonFeature,
  GeoJsonPolygonLayer,
} from "@/components/map/geojson";
import { localizeMap } from "@/util/map";
import { getInitialAreaNote, getIsEditMode } from "@/areaNote/selectors";
import {
  showMeasurements,
  updateMeasurements,
} from "@/components/map/measurements";
import {
  DEFAULT_LEAFLET_PATH_OPTIONS,
  DRAFT_GEOMETRY_COLOR,
  DRAFT_GEOMETRY_FILL_OPACITY,
} from "@/components/map/mapStyles";

type Props = {
  allowToEdit: boolean;
  bounds?: L.LatLngBoundsExpression;
  center?: L.LatLngExpression;
  isLoading?: boolean;
  onViewportChanged?: (...args: Array<any>) => any;
  overlayLayers?: Array<{
    checked: boolean;
    name: string;
    component: React.ReactNode;
  }>;
  showZoomLevelWarning?: boolean;
  zoom?: number;
  zoomLevelWarningText?: string;
};

const AreaNotesEditMap: React.FC<Props> = ({
  allowToEdit,
  bounds,
  center,
  isLoading,
  onViewportChanged,
  overlayLayers,
  showZoomLevelWarning,
  zoom,
  zoomLevelWarningText,
}) => {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(getInitialAreaNote);
  const isEditMode = useAppSelector(getIsEditMode);

  const featureGroupRef = useRef<L.FeatureGroup | null>(null);
  const saveConditionPanelRef = useRef<SaveConditionPanelHandle | null>(null);
  const previousIsEditModeRef = useRef(isEditMode);

  const [map, setMap] = useState<L.Map | null>(null);
  const [featureGroup, setFeatureGroup] = useState<L.FeatureGroup | null>(null);
  const [id, setId] = useState<number>(-1);
  const [isNew, setIsNew] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isSavePanelOpen, setIsSavePanelOpen] = useState(false);

  const getLayerCount = useCallback(() => {
    if (!featureGroupRef.current) {
      return 0;
    }

    return featureGroupRef.current.getLayers().length;
  }, []);

  const handleMapReady = useCallback((leafletMap: L.Map) => {
    const group = L.featureGroup().addTo(leafletMap);
    localizeMap(leafletMap);
    featureGroupRef.current = group;
    setMap(leafletMap);
    setFeatureGroup(group);
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
              ...DEFAULT_LEAFLET_PATH_OPTIONS,
              color: DRAFT_GEOMETRY_COLOR,
              fillOpacity: DRAFT_GEOMETRY_FILL_OPACITY,
            });
            featureGroupRef.current?.addLayer(layer);
            showMeasurements(layer);
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
      featureGroupRef.current?.eachLayer((layer) => {
        featureGroupRef.current?.removeLayer(layer);
      });
    }

    previousIsEditModeRef.current = isEditMode;
  }, [initialValues, isEditMode]);

  const updateAllFeatures = useMemo(
    () =>
      throttle(
        () => {
          featureGroupRef.current?.eachLayer((layer: any) => {
            showMeasurements(layer);
            updateMeasurements(layer);
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

  useEffect(() => {
    if (!isEditMode) {
      setIsSavePanelOpen(false);
      return;
    }

    const animationFrame = requestAnimationFrame(() => {
      setIsSavePanelOpen(true);
    });

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isEditMode]);

  const handleAction = useCallback(() => {
    setIsValid(getLayerCount() > 0);
  }, [getLayerCount]);

  const handleCreated = useCallback(
    (e: Record<string, any>) => {
      const { layer } = e;
      showMeasurements(layer);
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
      const features: Array<DrawnPolygonFeature> = [];
      featureGroupRef.current?.eachLayer((layer: GeoJsonPolygonLayer) =>
        features.push(layer.toGeoJSON()),
      );

      const payload = convertDrawnFeaturesToAreaNotePayload(features);
      payload.note = note;
      dispatch(createAreaNote(payload));
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (note: string) => {
      const features: Array<DrawnPolygonFeature> = [];
      featureGroupRef.current?.eachLayer((layer: GeoJsonPolygonLayer) =>
        features.push(layer.toGeoJSON()),
      );

      const payload = convertDrawnFeaturesToAreaNotePayload(features);
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
        onViewportChanged={onViewportChanged}
        overlayLayers={overlayLayers}
        zoom={zoom || DEFAULT_ZOOM}
        onMapReady={handleMapReady}
      />
      {allowToEdit && isEditMode && (
        <LeafletDrawControl
          map={map}
          featureGroup={featureGroup}
          onCreated={handleCreated}
          onDeleted={handleAction}
          onEdited={handleAction}
          onNonCommittedChange={handleNonCommittedChange}
          draw={DRAFT_DRAW_OPTIONS}
        />
      )}
      {allowToEdit && isEditMode && (
        <SaveConditionPanel
          ref={saveConditionPanelRef}
          disableDelete={isNew}
          disableSave={!isValid}
          isNew={isNew}
          onCancel={cancelChanges}
          onCreate={handleCreate}
          onDelete={handleDelete}
          onEdit={handleEdit}
          show={isSavePanelOpen}
        />
      )}
      {zoomLevelWarningText && (
        <ZoomLevelWarning
          isOpen={showZoomLevelWarning || false}
          text={zoomLevelWarningText}
        />
      )}
    </div>
  );
};

export default AreaNotesEditMap;
