import { createContext, useContext } from "react";
import type L from "leaflet";

export type LeafletLayerContainer = L.Map | L.LayerGroup;

export const LeafletMapContext = createContext<LeafletLayerContainer | null>(
  null,
);

export const useLeafletMap = (): LeafletLayerContainer | null =>
  useContext(LeafletMapContext);
