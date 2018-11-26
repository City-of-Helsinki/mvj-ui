import L from 'leaflet';

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
 * KTJ-links & datasets
 * @type {[*]}
 */
export const ktjDataSets = [
  {key: 'karttaote', label: 'Kiinteistörekisterin karttaote'},
  {key: 'kiinteistorekisteriote', label: 'Kiinteistörekisteriote'},
  {key: 'lainhuutotodistus', label: 'Lainhuutotodistus'},
  {key: 'muodostajarekisteriyksikot_ajankohtana', label: 'Muodostajarekisteriyksiköt ajankohtana'},
  {key: 'muodostajaselvitys', label: 'Muodostajaselvitys'},
  {key: 'muodostumisketju_taaksepain', label: 'Muodostumisketju taaksepäin'},
  {key: 'yhteystiedot', label: 'Omistajien yhteystiedot'},
  {key: 'rasitustodistus', label: 'Rasitustodistus'},
  {key: 'voimassa_olevat_muodostuneet', label: 'Voimassa olevat muodostuneet'},
];

/**
 * TileLayer
 * @type {string}
 */
// export const tileLayer = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
// export const tileLayer = 'https://geoserver.hel.fi/mapproxy/wmts/osm-lite-hq/etrs_tm35fin_hq/{z}/{x}/{y}.png';
// export const tileLayer = 'https://kartta.hel.fi/ws/geoserver/avoindata/wms?helsinki/{z}/{x}/{y}.png';
export const tileLayer = L.tileLayer.wms('http://kartta.hel.fi/ws/geoserver/helsinki/wms?helsinki', {layers: 'helsinki:Kaupunkikartta'});

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
export const defaultZoom = 5;

/**
 * Min zoom
 * @type {number}
 */
export const minZoom = 2;

/**
 * Max zoom
 * @type {number}
 */
export const maxZoom = 12;

/**
 * Map color palette
 */
export const mapColors = [
  '#388E3C',
  '#FF9800',
  '#1976D2',
  '#D32F2F',
  '#E040FB',
  '#FF4081',
  '#512DA8',
  '#536DFE',
  '#F57C00',
  '#E64A19',
  '#8BC34A',
  '#689F38',
  '#FFC107',
  '#CDDC39',
];

/**
 * Day options for dropdowns
 */
export const dayOptions = [
  {value: 1, label: '1'},
  {value: 2, label: '2'},
  {value: 3, label: '3'},
  {value: 4, label: '4'},
  {value: 5, label: '5'},
  {value: 6, label: '6'},
  {value: 7, label: '7'},
  {value: 8, label: '8'},
  {value: 9, label: '9'},
  {value: 10, label: '10'},
  {value: 11, label: '11'},
  {value: 12, label: '12'},
  {value: 13, label: '13'},
  {value: 14, label: '14'},
  {value: 15, label: '15'},
  {value: 16, label: '16'},
  {value: 17, label: '17'},
  {value: 18, label: '18'},
  {value: 19, label: '19'},
  {value: 20, label: '20'},
  {value: 21, label: '21'},
  {value: 22, label: '22'},
  {value: 23, label: '23'},
  {value: 24, label: '24'},
  {value: 25, label: '25'},
  {value: 26, label: '26'},
  {value: 27, label: '27'},
  {value: 28, label: '28'},
  {value: 29, label: '29'},
  {value: 30, label: '30'},
  {value: 31, label: '31'},
];

/**
 * Month options for dropdowns
 */
export const monthOptions = [
  {value: 1, label: '1'},
  {value: 2, label: '2'},
  {value: 3, label: '3'},
  {value: 4, label: '4'},
  {value: 5, label: '5'},
  {value: 6, label: '6'},
  {value: 7, label: '7'},
  {value: 8, label: '8'},
  {value: 9, label: '9'},
  {value: 10, label: '10'},
  {value: 11, label: '11'},
  {value: 12, label: '12'},
];
