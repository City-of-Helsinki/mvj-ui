/**
 * Avalable languages
 * @type {[*]}
 */
export const AvailableLanguages = [
  'en',
  'fi',
];

/**
 * Language to fallback
 * @type {string}
 */
export const FallbackLanguage = 'en';

/**
 * Languages
 * @type {[*]}
 */
export const Languages = [
  {id: 'en', label: 'EN'},
  {id: 'fi', label: 'FI'},
];

/**
 * TileLayer
 * @type {string}
 */
// export const tileLayer = 'http://kartta.hel.fi/ws/geoserver/gwc/service/tms/1.0.0/kanslia_palvelukartta:Karttasarja@ETRS-GK25@gif/{z}/{x}/{y}.gif';
// export const tileLayer = 'https://geoserver.hel.fi/mapproxy/wmts/osm-sm-hq/etrs_tm35fin_hq/{z}/{x}/{y}.png';
export const tileLayer = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';

/**
 * Default coordinates for Map (helsinki centrum)
 * @type {{lat: number, lng: number}}
 */
export const defaultCoordinates = {
  lat: 60.1699,
  lng: 24.9384,
};

/**
 * Default zoom
 * @type {number}
 */
export const defaultZoom = 12;
