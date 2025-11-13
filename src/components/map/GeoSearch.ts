import { useEffect } from "react";
import { useLeaflet } from "react-leaflet";
import { GeoSearchControl } from "leaflet-geosearch";
import type { Map } from "leaflet";
import HelsinkiProvider from "./HelsinkiProvider";

const GeoSearch = (): null => {
  const leaflet = useLeaflet();
  const map: Map = leaflet.map;

  useEffect(() => {
    if (!map) return;

    const geoSearchControl = GeoSearchControl({
      position: "topright",
      style: "bar",
      showMarker: false,
      provider: new HelsinkiProvider(),
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: false,
      searchLabel: "Hae osoitteella",
      zoomLevel: 9,
    });

    map.addControl(geoSearchControl);

    return () => {
      map.removeControl(geoSearchControl);
    };
  }, [map]);

  return null;
};

export default GeoSearch;
