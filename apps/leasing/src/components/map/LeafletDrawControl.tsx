import { useEffect } from "react";
import L from "leaflet";
import "leaflet-draw";

type Props = {
  map: L.Map | null;
  featureGroup: L.FeatureGroup | null;
  draw: L.Control.DrawOptions["draw"];
  onCreated?: (event: L.DrawEvents.Created) => void;
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

    const control = new L.Control.Draw({
      position: "topright",
      draw,
      edit: { featureGroup },
    });
    const handleCreated = (event: L.LeafletEvent) => {
      const createdEvent = event as L.DrawEvents.Created;
      featureGroup.addLayer(createdEvent.layer);
      onCreated?.(createdEvent);
    };
    const handleDeleted = () => onDeleted?.();
    const handleEdited = () => onEdited?.();
    const handleNonCommittedChange = () => onNonCommittedChange?.();

    map.addControl(control);
    map.on(L.Draw.Event.CREATED, handleCreated);
    map.on(L.Draw.Event.DELETED, handleDeleted);
    map.on(L.Draw.Event.EDITED, handleEdited);
    map.on(
      "draw:editmove draw:editvertex draw:editstop draw:deletestop",
      handleNonCommittedChange,
    );

    return () => {
      map.off(L.Draw.Event.CREATED, handleCreated);
      map.off(L.Draw.Event.DELETED, handleDeleted);
      map.off(L.Draw.Event.EDITED, handleEdited);
      map.off(
        "draw:editmove draw:editvertex draw:editstop draw:deletestop",
        handleNonCommittedChange,
      );
      map.removeControl(control);
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
