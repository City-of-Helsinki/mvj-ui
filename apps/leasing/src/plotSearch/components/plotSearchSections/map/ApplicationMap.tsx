import React, { useMemo } from "react";
import AreaNotesEditMap from "@/areaNote/components/AreaNotesEditMap";
import useAreaNotesOverlay from "@/components/map/useAreaNotesOverlay";

const ApplicationMap = () => {
  const areaNotesOverlay = useAreaNotesOverlay({ fetchOnMount: true });
  const overlayLayers = useMemo(
    () => (areaNotesOverlay ? [areaNotesOverlay] : []),
    [areaNotesOverlay],
  );

  return <AreaNotesEditMap allowToEdit={false} overlayLayers={overlayLayers} />;
};

export default ApplicationMap;
