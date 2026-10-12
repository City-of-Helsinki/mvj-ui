import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import L from "leaflet";
// This is a hack for Leaflet Draw, the issue and solution described at:
// https://github.com/Leaflet/Leaflet.draw/issues/1026#issuecomment-986702652
// @ts-ignore
window.type = true;
import { throttle } from "lodash-es";
import classNames from "classnames";
import MapContainer from "@/areaNote/components/MapContainer";
import LeafletDrawControl from "@/components/map/LeafletDrawControl";
import {
  showMeasurements,
  updateMeasurements,
} from "@/components/map/measurements";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/util/constants";
import {
  mergePolygonFeaturesToMultiPolygon,
  type DrawnPolygonFeature,
  type GeoJsonPolygonLayer,
} from "@/components/map/geojson";
const SHAPE_COLOR = "#9c27b0";
const SHAPE_FILL_OPACITY = 0.5;
const SHAPE_ERROR_COLOR = "#bd2719";
type Props = {
  change: (...args: Array<any>) => any;
  hasError: boolean;
};
const AreaSearchMap = ({ change, hasError }: Props) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [featureGroup, setFeatureGroup] = useState<L.FeatureGroup | null>(null);
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);

  useEffect(() => {
    featureGroupRef.current = featureGroup;
  }, [featureGroup]);

  const handleMapReady = useCallback((map: L.Map) => {
    const featureGroup = L.featureGroup().addTo(map);
    setMap(map);
    setFeatureGroup(featureGroup);
  }, []);
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
  useEffect(() => () => updateAllFeatures.cancel(), [updateAllFeatures]);

  const handleNonCommittedChange = useCallback(() => {
    updateAllFeatures();
  }, [updateAllFeatures]);
  const handleAction = useCallback(() => {
    const features: Array<DrawnPolygonFeature> = [];
    featureGroup?.eachLayer((layer: GeoJsonPolygonLayer) =>
      features.push(layer.toGeoJSON()),
    );
    change(mergePolygonFeaturesToMultiPolygon(features));
  }, [change, featureGroup]);
  const handleCreated = useCallback(
    (e: Record<string, any>) => {
      const { layer } = e;
      showMeasurements(layer);
      const features: Array<DrawnPolygonFeature> = [];
      featureGroup?.eachLayer((layer: GeoJsonPolygonLayer) =>
        features.push(layer.toGeoJSON()),
      );
      change(mergePolygonFeaturesToMultiPolygon(features));
    },
    [change, featureGroup],
  );

  return (
    <div
      className={classNames("AreaSearchMap", {
        "AreaSearchMap--has-error": hasError,
      })}
    >
      <div className="map">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          onMapReady={handleMapReady}
        />
        <LeafletDrawControl
          map={map}
          featureGroup={featureGroup}
          onCreated={handleCreated}
          onDeleted={handleAction}
          onEdited={handleAction}
          onNonCommittedChange={handleNonCommittedChange}
          draw={{
            circlemarker: false,
            circle: false,
            marker: false,
            polyline: false,
            polygon: {
              allowIntersection: false,
              showArea: true,
              drawError: { color: SHAPE_ERROR_COLOR, timeout: 1000 },
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
      </div>
    </div>
  );
};

export default AreaSearchMap;
