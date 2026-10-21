import type { PathOptions } from "leaflet";

export const DEFAULT_LEAFLET_PATH_OPTIONS: PathOptions = {
  weight: 2,
  fillOpacity: 0.2,
};

export const DRAFT_GEOMETRY_COLOR: PathOptions["color"] = "#9c27b0";
export const DRAFT_GEOMETRY_FILL_OPACITY: PathOptions["fillOpacity"] = 0.5;
export const SAVED_AREA_NOTE_COLOR: PathOptions["color"] = "#2196f3";

export const FEATURE_HIGHLIGHT_FILL_OPACITY: PathOptions["fillOpacity"] = 0.9;
export const FEATURE_HOVER_FILL_OPACITY: PathOptions["fillOpacity"] = 0.7;

export const MAP_LAYER_COLORS: Array<PathOptions["color"]> = [
  "#0078C0",
  "#FF9800",
  "#1976D2",
  "#D32F2F",
  "#E040FB",
  "#FF4081",
  "#512DA8",
  "#536DFE",
  "#F57C00",
  "#E64A19",
  "#8BC34A",
  "#689F38",
  "#FFC107",
  "#CDDC39",
];
