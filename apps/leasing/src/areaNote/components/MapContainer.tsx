import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import proj4 from "proj4";
import "proj4leaflet";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import LeafletAddressSearchControl from "@/components/map/LeafletAddressSearchControl";
import LeafletFullscreenControl from "@/components/map/LeafletFullscreenControl";
import { LeafletMapContext } from "@/components/map/LeafletMapContext";
import { MIN_ZOOM, MAX_ZOOM } from "@/util/constants";

const projectionBounds = L.bounds([25440000, 6630000], [25571072, 6761072]);
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
  onMapDidMount?: (viewport: MapViewport) => void;
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

const MapContainer: React.FC<Props> = ({
  bounds,
  center,
  isLoading,
  onMapDidMount,
  onViewportChanged,
  overlayLayers,
  zoom,
  enableSearch = true,
  onMapReady,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const onMapDidMountRef = useRef(onMapDidMount);
  const onViewportChangedRef = useRef(onViewportChanged);
  const onMapReadyRef = useRef(onMapReady);
  const mapConfigurationRef = useRef({
    bounds,
    center,
    enableSearch,
    zoom,
  });

  onMapDidMountRef.current = onMapDidMount;
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
    const baseLayers = {
      Karttasarja: L.tileLayer.wms(
        "https://kartta.hel.fi/ws/geoserver/avoindata/wms?",
        {
          layers: "avoindata:Karttasarja",
          format: "image/png",
          transparent: true,
        },
      ),
      Ortoilmakuva: L.tileLayer.wms(
        "https://kartta.hel.fi/ws/geoserver/avoindata/wms?",
        {
          layers: "avoindata:Ortoilmakuva",
          format: "image/png",
          transparent: true,
        },
      ),
      Asemakaava: L.tileLayer.wms(
        "https://kartta.hel.fi/ws/geoserver/avoindata/wms?",
        {
          layers: "avoindata:Ajantasa_asemakaava",
          format: "image/png",
          transparent: true,
        },
      ),
    };
    baseLayers.Karttasarja.addTo(map);
    L.control
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
    onMapDidMountRef.current?.(getMapValues());

    return () => {
      setMap(null);
      map.remove();
    };
  }, []);

  return (
    <LeafletMapContext.Provider value={map}>
      <div ref={containerRef}>
        {isLoading && (
          <LoaderWrapper className="relative-overlay-wrapper">
            <Loader isLoading={true} />
          </LoaderWrapper>
        )}
      </div>
      {overlayLayers?.map(({ checked, component, name }) => (
        <React.Fragment key={name}>{checked ? component : null}</React.Fragment>
      ))}
      {children}
    </LeafletMapContext.Provider>
  );
};

export default MapContainer;
