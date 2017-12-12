import {Languages} from '../constants';
import find from 'lodash/find';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import findIndex from 'lodash/findIndex';
import isNumber from 'lodash/isNumber';
import {toastr} from 'react-redux-toastr';
import moment from 'moment';
import Fraction from 'fraction.js';
import i18n from '../root/i18n';

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
    return 'small';
  if (width < 1024)
    return 'medium';
  if (width < 1200)
    return 'large';
  if (width < 1440)
    return 'xlarge';
  return 'xxlarge';
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

export const getActiveLanguage = () => {
  const {language} = i18n;
  let active = null;

  forEach(Languages, (item) => {
    if (item.id === language) {
      active = item;
      return false;
    }
  });

  return active;
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
  return toastr[opts.type](title, body, opts);
};

export const formatDate = (date: string) => {
  if (!date) {
    return '';
  }

  const d = isNumber(date) ? moment.unix(date) : moment(date);
  return d.format('DD.MM.YYYY');
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
  return moment(unix).format(format);
};

/**
 * Proxied KTJ-link
 * @param id
 * @param key
 * @param lang
 * @returns {string}
 */
export const getKtjLink = (id, key, lang = 'fi') => {
  /* global API_URL */
  const apiUrlWithOutVersionSuffix = API_URL.split('/v1')[0];
  return `${apiUrlWithOutVersionSuffix}/ktjkir/tuloste/${key}/pdf?kohdetunnus=${id}&lang=${lang}`;
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
 * Get areas coordinates & invert them
 * @param area
 */
export const getAreaCoordinates = (area) => area && get(area, 'mpoly.coordinates.0.0').map(arr => [arr[1], arr[0]]);

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
