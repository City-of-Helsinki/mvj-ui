import { TableSortOrder } from "@/enums";
export const DEFAULT_AREA_SEARCH_STATES: Array<string> = [];
export const DEFAULT_SORT_KEY = "identifier";
export const DEFAULT_SORT_ORDER = TableSortOrder.ASCENDING;

/**
 * Max zoom level to fetch leases for map
 * @const {number}
 */
export const MAX_ZOOM_LEVEL_TO_FETCH_AREA_SEARCHES = 7;

/**
 * Bounding box for search query
 * @const {string[]}
 */
export const BOUNDING_BOX_FOR_SEARCH_QUERY = [
  "24.681112147072024",
  "60.102173950499285",
  "25.388881322490807",
  "60.31481365757164",
];

/**
 * Default value for an area search application form field
 * in case of no value being defined in the field.
 * @const {string[]}
 */
export const EMPTY_DEFAULT_FIELD = {
  value: null,
};
