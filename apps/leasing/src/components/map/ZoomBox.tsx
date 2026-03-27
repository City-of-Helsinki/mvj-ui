import { useEffect } from "react";
import { useLeaflet } from "react-leaflet";
import { Control } from "leaflet";
import "leaflet-zoombox";
import type { Map } from "leaflet";
import type { ControlPosition } from "./types";

type Props = {
  position?: ControlPosition;
  addToZoomControl?: boolean;
  content?: string;
  className?: string;
  modal?: boolean;
  title?: string;
};

const ZoomBox = (props: Props) => {
  const leaflet = useLeaflet();
  const map: Map = leaflet.map;

  useEffect(() => {
    if (!map) return;

    const zoomBoxControl = new Control.ZoomBox(props);
    map.addControl(zoomBoxControl);

    return () => {
      map.removeControl(zoomBoxControl);
    };
  }, [map, props]);

  return null;
};

export default ZoomBox;
