import { createContext, useContext } from "react";
import type L from "leaflet";

export const LeafletMapContext = createContext<L.Map | null>(null);

export const useLeafletMap = (): L.Map | null => useContext(LeafletMapContext);
