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
 * Dropdown options
 */

export const decisionOptions = [
  {value: '0', label: 'ALK, 36, 14.07.2017'},
];

export const financialMethodOptions = [
  {value: 'A', label: 'Korkotuki yht. pitkä'},
  {value: 'B', label: 'Korkotuki yht. lyhyt'},
  {value: 'C', label: 'Korkotuki osakk. om.'},
  {value: 'D', label: 'Muu'},
  {value: '0', label: 'Ei tietoa'},
  {value: '1', label: 'Aravalainoitettu'},
  {value: '2', label: 'Vapaarahoitteinen'},
  {value: '3', label: 'Peruskorjauslaina'},
  {value: '4', label: 'Korkotuki'},
  {value: '5', label: 'Arava tai korkotuki'},
  {value: '6', label: 'Vapaarah. tai arava'},
  {value: '7', label: 'Vap. rah. tai korko'},
  {value: '8', label: 'Korkot./arava/vap.ra'},
  {value: '9', label: 'Muu kuin AV ja p. KT'},
];


export const managementMethodOptions = [
  {value: 'A', label: 'koe'},
  {value: 'B', label: 'koe 2'},
  {value: 'C', label: 'Asumisoikeus/omistus'},
  {value: 'D', label: 'Asumisoikeus/vuokra'},
  {value: 'E', label: 'Omistus ja vuokra'},
  {value: '0', label: 'Ei tietoa'},
  {value: '1', label: 'Omistus'},
  {value: '2', label: 'Vuokra'},
  {value: '3', label: 'Asumisoikeus'},
  {value: '4', label: 'Sekatalo'},
  {value: '5', label: 'Vuokra tai asumisoik'},
  {value: '6', label: 'Omistus tai vuokra'},
  {value: '7', label: 'Omist./vuokra/as.oik'},
  {value: '8', label: 'Osaomistus'},
  {value: '9', label: 'Asumisoik./osaomist.'},
];

export const priceTypeOptions = [
  {value: '0', label: '€ / v'},
  {value: '1', label: '€ / kk'},
];

export const purposeOptions = [
  {value: '100', label: 'Asuminen / yleinen'},
  {value: '101', label: 'Vapaarahoitteisia omistusasuntoja'},
  {value: '102', label: 'Aravaomistusasuntoja'},
  {value: '103', label: 'Vapaarahoitteisia vuokra-asuntoja'},
  {value: '104', label: 'Aravavuokrataloja'},
  {value: '105', label: 'Peruskorjattuja arava-vuokrataloja'},
  {value: '106', label: 'Omakotitalo'},
  {value: '107', label: 'Paritalo'},
  {value: '108', label: 'Sekatalo'},
  {value: '109', label: 'Asumisoikeusasuntoja'},
  {value: '110', label: 'Opiskelija-asuntoja'},
  {value: '111', label: 'Vanhusten asuntoja'},
  {value: '112', label: 'Palvelutalo/hoitokoti'},
];

export const researchStateOptions = [
  {value: '0', label: 'Tarkistamatta'},
  {value: '1', label: 'Vaati toimenpiteitä'},
  {value: '2', label: 'Valmis'},
];

export const constructionEligibilityRentConditionsOptions = [
  {value: '0', label: 'Kysytty'},
  {value: '1', label: 'Valmis'},
];

export const constructionEligibilityReportOptions = [
  {value: '0', label: 'Ei tarvita'},
  {value: '1', label: 'Tekeillä'},
  {value: '2', label: 'Valmis'},
];
