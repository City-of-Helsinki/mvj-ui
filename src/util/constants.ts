/**
 * Default coordinates for Map (helsinki centrum)
 * @readonly
 * @const {{lat: number, lng: number}}
 */
export const DEFAULT_CENTER = {
  lat: 60.1699,
  lng: 24.9384
};

/**
 * Default zoom level
 * @readonly
 * @const {number}
 */
export const DEFAULT_ZOOM = 5;

/**
 * Minimum zoom
 * @readonly
 * @const {number}
 */
export const MIN_ZOOM = 2;

/**
 * Maximum zoom
 * @readonly
 * @const {number}
 */
export const MAX_ZOOM = 12;

/**
 * Map color palette
 * @readonly
 * @const {string[]}
 */
export const MAP_COLORS = ['#0078C0', '#FF9800', '#1976D2', '#D32F2F', '#E040FB', '#FF4081', '#512DA8', '#536DFE', '#F57C00', '#E64A19', '#8BC34A', '#689F38', '#FFC107', '#CDDC39'];

/**
 * Url of the ptp.hel.fi API
 * @readonly
 * @const {string}
 */
export const PAIKKATIETOPALVELU_URL = 'https://ptp.hel.fi';

/**
 * Delete modal button text
 * @readonly
 * @const {string}
 */
export const DELETE_MODAL_BUTTON_TEXT = 'Poista';

/**
 * Maximum number of results per page on list tables
 * @readonly
 * @const {number}
 */
export const LIST_TABLE_PAGE_SIZE = 25;

/**
 * Base url for Service Map API
 * @readonly
 * @const {string}
 */
export const SERVICE_MAP_URL = 'https://api.hel.fi/servicemap/v2';