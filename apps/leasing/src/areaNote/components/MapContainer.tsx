import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import proj4 from "proj4";
import "proj4leaflet";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import LeafletAddressSearchControl from "@/components/map/LeafletAddressSearchControl";
import LeafletFullscreenControl from "@/components/map/LeafletFullscreenControl";
import { LeafletMapContext } from "@/components/map/LeafletMapContext";
import { HELSINKI_WMS_URL, MIN_ZOOM, MAX_ZOOM } from "@/util/constants";

const BASE_LAYER_NAMES = {
  Karttasarja: "avoindata:Karttasarja",
  Ortoilmakuva: "avoindata:Ortoilmakuva",
  Asemakaava: "avoindata:Ajantasa_asemakaava",
};

const projectionBounds = L.bounds([25440000, 6630000], [25571072, 6761072]);

const toLatLngBounds = (bounds: L.LatLngBoundsExpression) =>
  bounds instanceof L.LatLngBounds ? bounds : L.latLngBounds(bounds);

const CRS = new L.Proj.CRS(
  "EPSG:3879",
  "+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
  {
    resolutions: [
      256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125,
    ],
    bounds: projectionBounds,
  },
);

proj4.defs(
  "EPSG:3879",
  "+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
);
proj4.defs(
  "WGS84",
  "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees",
);

type Props = {
  bounds?: L.LatLngBoundsExpression;
  center: L.LatLngExpression;
  isLoading?: boolean;
  onViewportChanged?: (viewport: MapViewport) => void;
  overlayLayers?: Array<{
    checked: boolean;
    name: string;
    component: React.ReactNode;
  }>;
  zoom: number;
  enableSearch?: boolean;
  onMapReady?: (map: L.Map) => void;
  children?: React.ReactNode;
};

export type MapViewport = {
  bBox: string;
  zoom: number;
};

type OverlayLayerProps = NonNullable<Props["overlayLayers"]>[number] & {
  layerControl: L.Control.Layers;
  map: L.Map;
};

const OverlayLayer: React.FC<OverlayLayerProps> = ({
  checked,
  component,
  layerControl,
  map,
  name,
}) => {
  const layerRef = useRef<L.LayerGroup | null>(null);

  if (!layerRef.current) {
    layerRef.current = L.layerGroup();
  }

  const layer = layerRef.current;

  useEffect(() => {
    layerControl.addOverlay(layer, name);

    return () => {
      layerControl.removeLayer(layer);
      layer.removeFrom(map);
    };
  }, [layer, layerControl, map, name]);

  useEffect(() => {
    if (checked) {
      layer.addTo(map);
    } else {
      layer.removeFrom(map);
    }
  }, [checked, layer, map]);

  return (
    <LeafletMapContext.Provider value={layer}>
      {component}
    </LeafletMapContext.Provider>
  );
};

const MapContainer: React.FC<Props> = ({
  bounds,
  center,
  isLoading,
  onViewportChanged,
  overlayLayers,
  zoom,
  enableSearch = true,
  onMapReady,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const onViewportChangedRef = useRef(onViewportChanged);
  const onMapReadyRef = useRef(onMapReady);
  const layerControlRef = useRef<L.Control.Layers | null>(null);
  const mapConfigurationRef = useRef({
    bounds,
    center,
    enableSearch,
    zoom,
  });
  const viewportRef = useRef({ bounds, center });

  onViewportChangedRef.current = onViewportChanged;
  onMapReadyRef.current = onMapReady;
  mapConfigurationRef.current = {
    bounds,
    center,
    enableSearch,
    zoom,
  };

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const configuration = mapConfigurationRef.current;
    const map = L.map(containerRef.current, {
      attributionControl: false,
      center: configuration.center,
      maxBoundsViscosity: 0,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      zoom: configuration.zoom,
      zoomControl: false,
      crs: CRS,
      boxZoom: false,
    });
    if (configuration.bounds) {
      map.fitBounds(configuration.bounds);
    }
    const getMapValues = () => ({
      bBox: map.getBounds().toBBoxString(),
      zoom: map.getZoom(),
    });
    const handleViewportChanged = () => {
      onViewportChangedRef.current?.(getMapValues());
    };
    const baseLayers = Object.fromEntries(
      Object.entries(BASE_LAYER_NAMES).map(([title, layers]) => [
        title,
        L.tileLayer.wms(HELSINKI_WMS_URL, {
          layers,
          format: "image/png",
          transparent: true,
        }),
      ]),
    );
    baseLayers.Karttasarja.addTo(map);
    layerControlRef.current = L.control
      .layers(baseLayers, undefined, { position: "topright" })
      .addTo(map);
    if (configuration.enableSearch) {
      map.addControl(new LeafletAddressSearchControl({ position: "topright" }));
    }
    map.addControl(new LeafletFullscreenControl({ position: "topright" }));
    L.control
      .zoom({
        position: "topright",
        zoomInTitle: "Lähennä",
        zoomOutTitle: "Loitonna",
      })
      .addTo(map);
    map.on("moveend", handleViewportChanged);
    setMap(map);
    onMapReadyRef.current?.(map);

    return () => {
      layerControlRef.current = null;
      setMap(null);
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!map) {
      return;
    }

    const previousViewport = viewportRef.current;
    const boundsChanged =
      Boolean(previousViewport.bounds) !== Boolean(bounds) ||
      (previousViewport.bounds &&
        bounds &&
        !toLatLngBounds(previousViewport.bounds).equals(
          toLatLngBounds(bounds),
        ));
    const centerChanged = !L.latLng(previousViewport.center).equals(center);

    if (boundsChanged && bounds) {
      map.fitBounds(bounds);
    } else if (centerChanged) {
      map.setView(center);
    }

    viewportRef.current = { bounds, center };
  }, [bounds, center, map]);

  return (
    <LeafletMapContext.Provider value={map}>
      <div ref={containerRef}>
        {isLoading && (
          <LoaderWrapper className="relative-overlay-wrapper">
            <Loader isLoading={true} />
          </LoaderWrapper>
        )}
      </div>
      {map &&
        layerControlRef.current &&
        overlayLayers?.map(({ checked, component, name }) => (
          <OverlayLayer
            key={name}
            checked={checked}
            component={component}
            layerControl={layerControlRef.current}
            map={map}
            name={name}
          />
        ))}
      {children}
    </LeafletMapContext.Provider>
  );
};

export default MapContainer;
