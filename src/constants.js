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
  {value: '0', display_name: 'ALK, 36, 14.07.2017'},
];

export const financialMethodOptions = [
  {value: 'A', display_name: 'Korkotuki yht. pitkä'},
  {value: 'B', display_name: 'Korkotuki yht. lyhyt'},
  {value: 'C', display_name: 'Korkotuki osakk. om.'},
  {value: 'D', display_name: 'Muu'},
  {value: '0', display_name: 'Ei tietoa'},
  {value: '1', display_name: 'Aravalainoitettu'},
  {value: '2', display_name: 'Vapaarahoitteinen'},
  {value: '3', display_name: 'Peruskorjauslaina'},
  {value: '4', display_name: 'Korkotuki'},
  {value: '5', display_name: 'Arava tai korkotuki'},
  {value: '6', display_name: 'Vapaarah. tai arava'},
  {value: '7', display_name: 'Vap. rah. tai korko'},
  {value: '8', display_name: 'Korkot./arava/vap.ra'},
  {value: '9', display_name: 'Muu kuin AV ja p. KT'},
];


export const managementMethodOptions = [
  {value: 'A', display_name: 'koe'},
  {value: 'B', display_name: 'koe 2'},
  {value: 'C', display_name: 'Asumisoikeus/omistus'},
  {value: 'D', display_name: 'Asumisoikeus/vuokra'},
  {value: 'E', display_name: 'Omistus ja vuokra'},
  {value: '0', display_name: 'Ei tietoa'},
  {value: '1', display_name: 'Omistus'},
  {value: '2', display_name: 'Vuokra'},
  {value: '3', display_name: 'Asumisoikeus'},
  {value: '4', display_name: 'Sekatalo'},
  {value: '5', display_name: 'Vuokra tai asumisoik'},
  {value: '6', display_name: 'Omistus tai vuokra'},
  {value: '7', display_name: 'Omist./vuokra/as.oik'},
  {value: '8', display_name: 'Osaomistus'},
  {value: '9', display_name: 'Asumisoik./osaomist.'},
];

export const priceTypeOptions = [
  {value: '0', display_name: '€ / v'},
  {value: '1', display_name: '€ / kk'},
];

export const purposeOptions = [
  {value: '100', display_name: 'Asuminen / yleinen'},
  {value: '101', display_name: 'Vapaarahoitteisia omistusasuntoja'},
  {value: '102', display_name: 'Aravaomistusasuntoja'},
  {value: '103', display_name: 'Vapaarahoitteisia vuokra-asuntoja'},
  {value: '104', display_name: 'Aravavuokrataloja'},
  {value: '105', display_name: 'Peruskorjattuja arava-vuokrataloja'},
  {value: '106', display_name: 'Omakotitalo'},
  {value: '107', display_name: 'Paritalo'},
  {value: '108', display_name: 'Sekatalo'},
  {value: '109', display_name: 'Asumisoikeusasuntoja'},
  {value: '110', display_name: 'Opiskelija-asuntoja'},
  {value: '111', display_name: 'Vanhusten asuntoja'},
  {value: '112', display_name: 'Palvelutalo/hoitokoti'},
];

export const researchStateOptions = [
  {value: '0', display_name: 'Tarkistamatta'},
  {value: '1', display_name: 'Vaati toimenpiteitä'},
  {value: '2', display_name: 'Valmis'},
];

export const constructionEligibilityRentConditionsOptions = [
  {value: '0', display_name: 'Kysytty'},
  {value: '1', display_name: 'Valmis'},
];

export const constructionEligibilityReportOptions = [
  {value: '0', display_name: 'Ei tarvita'},
  {value: '1', display_name: 'Tekeillä'},
  {value: '2', display_name: 'Valmis'},
];

export const districtItemExplanationOptions = [
  {value: 'kaavayksikkö', display_name: 'Kaavayksikkö'},
  {value: 'kiinteistö', display_name: 'Kiinteisto'},
  {value: 'määräala', display_name: 'Määräala'},
  {value: 'muu', display_name: 'Muu'},
];

export const districtItemPositionOptions = [
  {value: 'maanpäällinen', display_name: 'Maanpäällinen'},
  {value: 'maanalainen', display_name: 'Maanalainen'},
];

export const planUnitConditionOptions = [
  {value: 'numeronvaraus', display_name: 'Numeronvaraus'},
  {value: 'vireillä', display_name: 'Vireillä'},
  {value: 'voimassa', display_name: 'Voimassa'},
  {value: 'kumottu', display_name: 'Kumottu'},
];

export const planUnitStateOptions = [
  {value: 'luonnos', display_name: 'Luonnos'},
  {value: 'voimassa', display_name: 'Voimassa'},
];

export const planUnitTypeOptions = [
  {value: 'rekisteröity yleinen alue', display_name: 'Rekisteröity yleinen alue'},
  {value: 'ohjeellinen kaavatontti', display_name: 'Ohjeellinen kaavatontti'},
  {value: 'vireillä olevan tonttijaon/-muutoksen mukainen tontti', display_name: 'Vireillä olevan tonttijaon/-muutoksen mukainen tontti'},
  {value: 'vireillä olevan tonttijaonmuutoksen mukainen tontti', display_name: 'Vireillä olevan tonttijaonmuutoksen mukainen tontti'},
  {value: 'hyväksytyn tonttijaon mukainen tontti', display_name: 'Hyväksytyn tonttijaon mukainen tontti'},
  {value: 'muodostusluetteloon merkitty tontti', display_name: 'Muodostusluetteloon merkitty tontti'},
  {value: 'tonttirekisteritontti', display_name: 'Tonttirekisteritontti'},
  {value: 'muun kuin korttelialueen yksikkö', display_name: 'Muun kuin korttelialueen yksikkö'},
  {value: 'keinoyksikkö (maarekisterialue)', display_name: 'Keinoyksikkö (maarekisterialue)'},
  {value: 'keinokaavayksikkö (yleisen alueen lisäosa)', display_name: 'Keinokaavayksikkö (yleisen alueen lisäosa)'},
];

export const planUnitUseOptions = [
  {value: 'kiinteistö', display_name: 'Kiinteistö'},
  {value: 'määräala', display_name: 'Määräala'},
];

export const plotTypeOptions = [
  {value: '0', display_name: '02 AK (kerrostalo)'},
];

export const propertyItemExplanationOptions = [
  {value: 'kiinteistö', display_name: 'Kiinteistö'},
  {value: 'määräala', display_name: 'Määräala'},
];

export const contractTypeOptions = [
  {value: 'vuokrasopimus', display_name: 'Vuokrasopimus'},
  {value: 'esisopimus', display_name: 'Esisopimus'},
  {value: 'rasitesopimus', display_name: 'Rasitesopimus'},
];
