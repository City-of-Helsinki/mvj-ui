import { useEffect } from "react";
import L from "leaflet";
import "@geoman-io/leaflet-geoman-free";

type Props = {
  map: L.Map | null;
  featureGroup: L.FeatureGroup | null;
  draw: {
    polygon?: L.PM.DrawModeOptions | false;
    rectangle?: L.PM.DrawModeOptions | false;
  };
  onCreated?: (event: { layer: L.Layer }) => void;
  onDeleted?: () => void;
  onEdited?: () => void;
  onNonCommittedChange?: () => void;
};

const LeafletDrawControl = ({
  map,
  featureGroup,
  draw,
  onCreated,
  onDeleted,
  onEdited,
  onNonCommittedChange,
}: Props) => {
  useEffect(() => {
    if (!map || !featureGroup) {
      return;
    }

    map.pm.setGlobalOptions({
      layerGroup: featureGroup,
      allowSelfIntersection: false,
    });
    const polygonOptions = draw.polygon || undefined;
    const rectangleOptions = draw.rectangle || undefined;
    map.pm.setPathOptions(
      polygonOptions?.pathOptions ?? rectangleOptions?.pathOptions ?? {},
    );
    map.pm.addControls({
      position: "topright",
      drawMarker: false,
      drawCircleMarker: false,
      drawCircle: false,
      drawPolyline: false,
      drawPolygon: Boolean(draw.polygon),
      drawRectangle: Boolean(draw.rectangle),
      drawText: false,
      editMode: true,
      removalMode: true,
      dragMode: false,
      cutPolygon: false,
      rotateMode: false,
    });
    const handleCreated = (event: { layer: L.Layer }) => onCreated?.(event);
    const handleDeleted = () => {
      map.pm.disableGlobalRemovalMode();
      onDeleted?.();
    };
    const handleEdited = () => onEdited?.();
    const handleNonCommittedChange = () => onNonCommittedChange?.();

    map.on("pm:create", handleCreated);
    map.on("pm:remove", handleDeleted);
    map.on("pm:edit", handleEdited);
    map.on("pm:change", handleNonCommittedChange);

    return () => {
      map.off("pm:create", handleCreated);
      map.off("pm:remove", handleDeleted);
      map.off("pm:edit", handleEdited);
      map.off("pm:change", handleNonCommittedChange);
      map.pm.removeControls();
    };
  }, [
    draw,
    featureGroup,
    map,
    onCreated,
    onDeleted,
    onEdited,
    onNonCommittedChange,
  ]);

  return null;
};

export default LeafletDrawControl;
