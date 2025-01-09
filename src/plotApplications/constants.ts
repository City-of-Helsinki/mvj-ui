import { TableSortOrder } from "@/enums";

/**
 * Default plotApplications states value for plotSearch list search
 * @const {string[]}
 */
export const DEFAULT_PLOT_APPLICATIONS_STATES: Array<any> = [];

/**
 * Default sort key for plot applications list table
 * @const {string}
 */
export const DEFAULT_SORT_KEY = "identifier";

/**
 * Default sort order for plot applications list table
 * @const {string}
 */
export const DEFAULT_SORT_ORDER = TableSortOrder.ASCENDING;

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
 * Max zoom level to fetch leases for map
 * @const {number}
 */
export const MAX_ZOOM_LEVEL_TO_FETCH_LEASES = 7;
