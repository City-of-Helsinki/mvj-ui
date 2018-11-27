import React from 'react';
import {Languages} from '../constants';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import {toastr} from 'react-redux-toastr';
import moment from 'moment';
import L from 'leaflet';
import Fraction from 'fraction.js';
import ToastrIcons from '../components/toastr/ToastrIcons';

import {Breakpoints} from '$src/foundation/enums';

// import i18n from '../root/i18n';

/**
 *
 * @returns {number}
 */
export const getDocumentWidth = () => {
  return Math.max(
    document.documentElement['clientWidth'],
    document.body['scrollWidth'],
    document.documentElement['scrollWidth'],
    document.body['offsetWidth'],
    document.documentElement['offsetWidth'],
  );
};

/**
 *
 * @returns {*}
 */
export const getFoundationBreakpoint = () => {
  const width = getDocumentWidth();
  if (width < 640)
    return Breakpoints.SMALL;
  if (width < 1024)
    return Breakpoints.MEDIUM;
  if (width < 1200)
    return Breakpoints.LARGE;
  if (width < 1440)
    return Breakpoints.XLARGE;
  return Breakpoints.XXLARGE;
};

/**
 *
 * @returns {*}
 */
export const isLargeScreen = () => {
  const breakpoint = getFoundationBreakpoint();

  switch (breakpoint) {
    case Breakpoints.SMALL:
      return false;
    case Breakpoints.MEDIUM:
      return false;
    default:
      return true;
  }
};

/**
 *
 * @param language
 * @returns {boolean}
 */
export const isAllowedLanguage = (language) => {
  return !!find(Languages, (item) => {
    return language === item;
  });
};

export const scrollToTopPage = () => {
  const body = document.getElementsByTagName('body');
  const html = document.getElementsByTagName('html');
  if(body.length) {
    body[0].scrollTop = 0;
  }
  if(html.length) {
    html[0].scrollTop = 0;
  }
};

export const getActiveLanguage = () => {
  // const {language} = i18n;
  // let active = null;
  //
  // forEach(Languages, (item) => {
  //   if (item.id === language) {
  //     active = item;
  //     return false;
  //   }
  // });
  //
  // return active;
};

export const cloneObject = (obj: Object) => {
  var clone = {};
  for(const i in obj) {
    if(obj[i] != null &&  typeof(obj[i]) === 'object') {
      clone[i] = cloneObject(obj[i]);
    } else {
      clone[i] = obj[i];
    }
  }
  return clone;
};

export const getSearchQuery = (filters) => {
  let query = [];

  forEach(filters, (filter, key) => {
    if (!isEmpty(filter) || isNumber(filter)) {
      if (isArray(filter)) {
        const items = [];
        forEach(filter, (item) => {
          items.push(encodeURIComponent(item));
        });
        filter = items;
      }

      if (key === 'page' && Number(filter) < 2) {
        return;
      }

      query.push(`${key}=${isArray(filter) ? filter.join(',') : encodeURIComponent(filter)}`);
    }
  });

  return query.length ? `?${query.join('&')}` : '';
};

export const isEmptyValue = (value) => (value === null || value === undefined || value === '');


/**
 * Set leaflet draw strings in Finnish
 */
export const localizeMap = () => {
  L.drawLocal.draw.handlers.circle.tooltip.start = 'Klikkaa ja raahaa piirtääksesi ympyrän';
  L.drawLocal.draw.handlers.circle.radius = 'Säde';
  L.drawLocal.draw.handlers.polygon.tooltip.start = 'Aloita alueen piirtäminen klikkaamalla.';
  L.drawLocal.draw.handlers.polygon.tooltip.cont = 'Jatka alueen piirtämistä klikkaamalla';
  L.drawLocal.draw.handlers.polygon.tooltip.end = 'Klikkaa ensimmäistä pistettä kuvion päättämiseksi';
  L.drawLocal.draw.handlers.polyline.error = '<strong>Virhe:</strong> kuvion reunat ei saa leikata toisiaan!';
  L.drawLocal.draw.handlers.polyline.tooltip.start = 'Aloita viivan piirtäminen klikkaamalla.';
  L.drawLocal.draw.handlers.polyline.tooltip.cont = 'Jatka viivan piirtämistä klikkaamalla';
  L.drawLocal.draw.handlers.polyline.tooltip.end = 'Klikkaa viimeistä pistettä viivan päättämiseksi';
  L.drawLocal.draw.handlers.rectangle.tooltip.start = 'Klikkaa ja raahaa piirtääksesi suorakulmion';
  L.drawLocal.draw.handlers.simpleshape.tooltip.end = 'Vapauta hiiren painike päättääksesi piirtämisen.';

  L.drawLocal.edit.handlers.edit.tooltip.text = 'Muokkaa ominaisuuksia vetämällä kahvoja';
  L.drawLocal.edit.handlers.edit.tooltip.subtext = 'Klikkaa peruuta-painiketta kumotaksesi muutokset';
  L.drawLocal.edit.handlers.remove.tooltip.text = 'Klikkaa aluetta poistaaksesi sen';

  L.drawLocal.draw.toolbar.actions.title = 'Peruuta piirtäminen';
  L.drawLocal.draw.toolbar.actions.text = 'Peruuta';
  L.drawLocal.draw.toolbar.finish.title = 'Lopeta piirtäminen';
  L.drawLocal.draw.toolbar.finish.text = 'Lopeta';
  L.drawLocal.draw.toolbar.undo.title = 'Poista viimeisin piirretty piste';
  L.drawLocal.draw.toolbar.undo.text = 'Poista viimeisin piste';

  L.drawLocal.edit.toolbar.actions.save.title = 'Tallenna muutokset';
  L.drawLocal.edit.toolbar.actions.save.text = 'Tallenna';
  L.drawLocal.edit.toolbar.actions.cancel.title = 'Peruuta muutokset';
  L.drawLocal.edit.toolbar.actions.cancel.text = 'Peruuta';
  L.drawLocal.edit.toolbar.actions.clearAll.title = 'Poista kaikki';
  L.drawLocal.edit.toolbar.actions.clearAll.text = 'Poista kaikki';

  L.drawLocal.draw.toolbar.buttons.polyline = 'Piirrä viiva';
  L.drawLocal.draw.toolbar.buttons.polygon = 'Piirrä monikulmio';
  L.drawLocal.draw.toolbar.buttons.rectangle = 'Piirrä suorakaide';
  L.drawLocal.draw.toolbar.buttons.circle = 'Piirrä ympyrä';
  L.drawLocal.edit.toolbar.buttons.editDisabled = 'Ei muokattavia alueita';
  L.drawLocal.edit.toolbar.buttons.edit = 'Muokkaa alueita';
  L.drawLocal.edit.toolbar.buttons.editDisabled = 'Ei muokattavia alueita';
  L.drawLocal.edit.toolbar.buttons.remove = 'Poista alueita';
  L.drawLocal.edit.toolbar.buttons.removeDisabled = 'Ei poistettavia alueita';
};

export const getCoordsToLatLng = (geojson) => {
  let crs;

  if (geojson) {
    if (geojson.crs && geojson.crs.type === 'name') {
      crs = new L.Proj.CRS(geojson.crs.properties.name);
    } else if (geojson.crs && geojson.crs.type) {
      crs = new L.Proj.CRS(geojson.crs.type + ':' + geojson.crs.properties.code);
    }

    if (crs !== undefined) {
      return function(coords) {
        var point = L.point(coords[0], coords[1]);
        return crs.projection.unproject(point);
      };
    }
  }
};

/**
 *
 * @param title
 */
export const setPageTitle = (title) => {
  document.title = `${title}`;
};

/**
 * Generate formData from fields
 * @param formDataf
 * @param data
 * @param previousKey
 * @returns {*}
 */
export const generateFormData = (formData, data, previousKey) => {
  if (data instanceof Object) {
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value instanceof Object && !Array.isArray(value)) {
        return generateFormData(formData, value, key);
      }
      if (previousKey) {
        key = `${previousKey}[${key}]`;
      }
      if (Array.isArray(value)) {
        value.forEach(val => {
          formData.append(`${key}[]`, val);
        });
      } else {
        formData.append(key, value);
      }
    });
  }

  return formData;
};

/**
 * Display message in UI
 * @param message
 * @param opts
 */
export const displayUIMessage = (message, opts = {type: 'success'}) => {
  const {title, body} = message;
  const icon = <ToastrIcons name={opts.type} />;
  return toastr[opts.type](title, body, {...opts, icon: icon});
};

/**
 * Format number to fixed length
 * @param value
 * @param length
 */
export const fixedLengthNumber = (value: ?number, length: number = 2) => {
  if (value !== 0 && !value) {
    return '';
  }
  const size = value.toString().length;
  if (size < length) {
    let prefix = '';
    for (let i = 1; i <= (length - size); i++) {
      prefix += '0';
    }
    return prefix + value.toString();
  }
  return  value.toString();
};

export const getEpochTime = () =>
  Math.round(new Date().getTime()/1000.0);

export const formatDate = (date: string) => {
  if (!date) {
    return '';
  }

  const d = isNumber(date) ? moment.unix(date) : moment(date);
  return d.format('DD.MM.YYYY');
};

export const formatNumberWithThousandSeparator = (x, separator = ' ') => {
  if(x === null || x === undefined || !isNumber(Number(x))) {
    return null;
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};

export const formatDecimalNumber = (x) => {
  if(x === null || x === undefined || !isNumber(Number(x))) {
    return null;
  }
  return parseFloat(x).toFixed(2).toString().replace('.', ',');
};

export const formatNumber = (x) => {
  if(x === null || x === undefined || !isNumber(Number(x))) {
    return null;
  }

  return formatNumberWithThousandSeparator(formatDecimalNumber(x));
};

export const formatDecimalNumberForDb = (x) => {
  if(x === null || x === undefined) {
    return null;
  }
  return Number(x.toString().replace(',', '.').replace(/\s+/g, ''));
};

export const formatDateRange = (startDate: any, endDate: any) => {
  if (!startDate && !endDate) {
    return '';
  }

  const start = isNumber(startDate) ? moment.unix(startDate) : moment(startDate),
    end = isNumber(endDate) ? moment.unix(endDate) : moment(endDate);

  const dateFormat = 'DD.MM.YYYY';

  if(!startDate) {
    return `- ${end.format(dateFormat)}`;
  }
  if(!endDate) {
    return `${start.format(dateFormat)} -`;
  }

  return `${start.format(dateFormat)} - ${end.format(dateFormat)}`;
};

/**
 *
 * @param unix
 * @param format
 * @returns {string}
 */
export const formatDateObj = (unix, format = 'DD.MM.YYYY HH:mm') => {
  return unix ? moment(unix).format(format) : null;
};

/**
 * get API-url without version suffix
 * @returns {string}
 */
export const getApiUrlWithOutVersionSuffix = () => {
  /* global API_URL */
  return API_URL.split('/v1')[0];
};

/**
 * Proxied KTJ-link
 * @param id
 * @param key
 * @param lang
 * @returns {string}
 */
export const getKtjLink = (id, key, lang = 'fi') => {
  const apiUrlWithOutVersionSuffix = getApiUrlWithOutVersionSuffix();
  return `${apiUrlWithOutVersionSuffix}/ktjkir/tuloste/${key}/pdf?kohdetunnus=${id}&lang=${lang}`;
};

/**
 * Get reference number link from Päätökset
 * @param referenceNumber
 * @returns {string}
 */
export const getReferenceNumberLink = (referenceNumber: ?string) => {
  const apiUrl = 'https://dev.hel.fi/paatokset/asia';
  return referenceNumber ? `${apiUrl}/${referenceNumber.replace(' ', '-').toLowerCase()}` : null;
};

/**
 * Find from collection with ID
 * @param collection
 * @param id
 * @returns {*}
 */
export const findIndexOfArrayfield = (collection, id) => {
  return findIndex(collection, {id});
};

/**
 * Find item from collection with ID
 * @param collection
 * @param id
 * @returns {*}
 */
export const findItemById = (collection, id) => {
  return collection.find((item) => item.id === id);
};

export const getLabelOfOption = (options: Array<Object>, value: string) => {
  if(!options || !options.length || value === undefined || value === null) {
    return null;
  }
  const option = options.find(x => x.value.toString() === value.toString());
  return get(option, 'label', '');
};

/**
 * Get areas coordinates & invert them
 * @param area
 */
export const getAreaCoordinates = (area) => area && get(area, 'mpoly.coordinates.0.0').map(arr => [arr[1], arr[0]]);

export const getCoordinatesOfGeometry = (geometry: any) => {
  if(!geometry) {
    return [];
  }

  const getSingleArrayOfCoordinates = (items) => {
    let tempCoords = [];
    if(isArray(items) && !isArray(items[0])) {
      tempCoords.push([items[0], items[1]]);
    } else {
      items.forEach((item) => {
        tempCoords = [...tempCoords, ...getSingleArrayOfCoordinates(item)];
      });
    }

    return tempCoords;
  };

  return getSingleArrayOfCoordinates(geometry.coordinates);
};

export const getCoordinatesCenter = (coordinates: Array<any>) => {
  const lats = [],
    lons = [];

  coordinates.forEach((coordinate) => {
    lats.push(coordinate[0]);
    lons.push(coordinate[1]);
  });

  const minLat = Math.min(...lats),
    maxLat = Math.max(...lats),
    minLon = Math.min(...lons),
    maxLon = Math.max(...lons),
    lat = maxLat - ((maxLat - minLat) / 2),
    lng = maxLon - ((maxLon - minLon) / 2);

  return [lng, lat];
};

export const getCoordinatesBounds = (coordinates: Array<any>) => {
  const lats = [],
    lons = [];

  coordinates.forEach((coordinate) => {
    lats.push(coordinate[0]);
    lons.push(coordinate[1]);
  });

  const minLat = Math.min(...lats),
    maxLat = Math.max(...lats),
    minLon = Math.min(...lons),
    maxLon = Math.max(...lons),
    maxBoundsSouthWest = new L.LatLng(minLon, minLat),
    maxBoundsNorthEast = new L.LatLng(maxLon, maxLat);

  return new L.LatLngBounds(maxBoundsSouthWest, maxBoundsNorthEast);
};

export const getCircleCenter = (c) => [c[1], c[0]];

export const getCoordinates = (c) => c.map(arr => [arr[1], arr[0]]);

export const getCoordinatesPolygon = (c) => c.map(arr1 => arr1.map(arr2 => [arr2[1], arr2[0]]));

/**
 * Get full amount of rent
 * @param rents
 */
export const getFullRent = (rents) => rents.reduce((total, {amount}) => parseFloat(amount) + total, 0);

/**
 * Generate a fraction from float
 * @param float
 */
export const getFractionFromFloat = (float) => new Fraction(float).toFraction(true);

/**
 * Get tenants yearly share
 * @param share
 * @param rents
 */
// TODO: Only if the rent-type is fixed (monthly)
export const getTenantsYearlyShare = ({share}, rents) => (getFullRent(rents) * 12) * parseFloat(share);

export const addEmptyOption = (options: Array<Object>) =>
  [{value: '', label: ''}, ...options];

/**
 * Get options for attribute field
 * @param attributes
 * @param path
 */
export const getAttributeFieldOptions = (attributes: Object, path: string, addEmpty: boolean = true, showValue: boolean = false) => {
  const results = get(attributes, `${path}.choices`, []).map((item) => {
    return {
      value: item.value,
      label: showValue ? `${item.display_name} (${item.value})`: item.display_name,
    };
  });

  if(addEmpty) {return addEmptyOption(results);}
  return results;
};

/**
 * Get options for attribute field
 * @param attributes
 * @param addEmpty
 * @param showValue
 */
export const getFieldOptions = (fieldAttributes: Object, addEmpty: boolean = true, showValue: boolean = false) => {
  const results = get(fieldAttributes, `choices`, []).map((item) => {
    return {
      value: item.value,
      label: showValue ? `${item.display_name} (${item.value})`: item.display_name,
    };
  });

  if(addEmpty) {return addEmptyOption(results);}
  return results;
};

export const sortNumberByKeyAsc = (a, b, key) => {
  const keyA = get(a, key),
    keyB = get(b, key);

  return Number(keyA) - Number(keyB);
};

export const sortNumberByKeyDesc = (a, b, key) => {
  const keyA = get(a, key),
    keyB = get(b, key);
  return Number(keyB) - Number(keyA);
};

export const sortStringByKeyAsc = (a, b, key?: string = null) => {
  const keyA = key ? (get(a, key) ? get(a, key).toLowerCase() : '') : a,
    keyB = key ? (get(b, key) ? get(b, key).toLowerCase() : '') : b;

  if(keyA > keyB) return 1;
  if(keyA < keyB) return -1;
  return 0;
};

export const sortStringByKeyDesc = (a, b, key?: string = null) => {
  const keyA = key ? (get(a, key) ? get(a, key).toLowerCase() : '') : a,
    keyB = key ? (get(b, key) ? get(b, key).toLowerCase() : '') : b;
  if(keyA > keyB) return -1;
  if(keyA < keyB) return 1;
  return 0;
};

export const sortByOptionsAsc = (a: Object, b: Object, key, options: Array<Object>) => {
  const keyA = a[key] ? getLabelOfOption(options, a[key]) : '',
    keyB = b[key] ? getLabelOfOption(options, b[key]) : '';
  if(keyA > keyB) return 1;
  if(keyA < keyB) return -1;
  return 0;
};

export const sortByOptionsDesc = (a: Object, b: Object, key, options: Array<Object>) => {
  const keyA = a[key] ? getLabelOfOption(options, a[key]) : '',
    keyB = b[key] ? getLabelOfOption(options, b[key]) : '';
  if(keyA > keyB) return -1;
  if(keyA < keyB) return 1;
  return 0;
};

export const sortByLabelAsc = (a, b) =>
  sortStringByKeyAsc(a, b, 'label');

export const sortByLabelDesc = (a, b) =>
  sortStringByKeyDesc(a, b, 'label');

export const sortByStartDateDesc = (a, b) =>
  sortStringByKeyDesc(a, b, 'start_date');

export const sortByDueDateDesc = (a, b) =>
  sortStringByKeyDesc(a, b, 'due_date');

const getFileNameByContentDisposition = (contentDisposition) => {
  const regex = /filename[^;=\n]*=(UTF-8(['"]*))?(.*)/;
  const matches = regex.exec(contentDisposition);
  let filename;

  if (matches != null && matches[3]) {
    filename = matches[3].replace(/['"]/g, '');
  }

  return filename ? decodeURI(filename) : null;
};

export const getFileNameFromResponse = (response) => {
  const disposition = response.headers.get('content-disposition');
  return getFileNameByContentDisposition(disposition);
};

export const sortByStartAndEndDateDesc = (a, b) => {
  const startA = get(a, 'start_date', ''),
    endA = get(a, 'end_date', ''),
    startB = get(b, 'start_date', ''),
    endB = get(b, 'end_date', '');

  if(startA > startB) return -1;
  if(startA < startB) return 1;
  if(endA > endB) return -1;
  if(endA < endB) return 1;
  return 0;
};
