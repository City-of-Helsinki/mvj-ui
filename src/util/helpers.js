// @flow
import React from 'react';
import {Languages} from '../constants';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import {toastr} from 'react-redux-toastr';
import moment from 'moment';
import Fraction from 'fraction.js';

import ToastrIcons from '$components/toastr/ToastrIcons';
import {Breakpoints} from '$src/foundation/enums';

import type {Attributes} from '$src/types';
import type {UsersPermissions} from '$src/usersPermissions/types';

// import i18n from '../root/i18n';

/**
 *
 * @returns {number}
 */
export const getDocumentWidth = () => {
  return Math.max(
    // $FlowFixMe
    document.documentElement['clientWidth'],
    // $FlowFixMe
    document.body['scrollWidth'],
    // $FlowFixMe
    document.documentElement['scrollWidth'],
    // $FlowFixMe
    document.body['offsetWidth'],
    // $FlowFixMe
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
export const isAllowedLanguage = (language: string) => {
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
  return {};
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

export const getSearchQuery = (filters: any) => {
  let query = [];

  forEach(filters, (filter: any, key) => {
    if (!isEmpty(filter) || isNumber(filter) || typeof 'boolean') {
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

export const getUrlParams = (search: string = ''): Object => {
  const query = {};
  const entries = search.replace('?', '').split('&');

  entries.forEach((entry) => {
    const split = entry.split('=');
    const key = decodeURIComponent(split[0]);
    const value = decodeURIComponent(split[1]);

    if(!key) return;

    if(query[key]) {
      if(isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  });

  return query;
};

/**
 *
 * @param title
 */
export const setPageTitle = (title: string) => {
  document.title = `${title}`;
};

/**
 * Generate formData from fields
 * @param formData
 * @param data
 * @param previousKey
 * @returns {*}
 */
export const generateFormData = (formData: Object, data: Object, previousKey: string) => {
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
export const displayUIMessage = (message: Object, opts?: Object = {type: 'success'}) => {
  const {title, body} = message;
  const icon = <ToastrIcons name={opts.type} />;
  return toastr[opts.type](title, body, {...opts, icon: icon});
};

export const isEmptyValue = (value: any): boolean => (value === null || value === undefined || value === '');

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

export const getEpochTime = () => Math.round(new Date().getTime()/1000.0);

export const formatNumberWithThousandSeparator = (x: any, separator?: string = ' ') => !isEmptyValue(x) ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator) : '';

export const formatDecimalNumber = (x: ?number) => !isEmptyValue(x) ? parseFloat(x).toFixed(2).toString().replace('.', ',') : null;

export const formatNumber = (x: any) => !isEmptyValue(x) ? formatNumberWithThousandSeparator(formatDecimalNumber(x)) : '';

export const convertStrToDecimalNumber = (x: any) => isEmptyValue(x) ? null : Number(x.toString().replace(',', '.').replace(/\s+/g, ''));

/**
* Format date string
* @param date
* @param format
* @returns {string}
*/
export const formatDate = (date: any, format?: string = 'DD.MM.YYYY') => {
  if (!date) return null;

  const d = isNumber(date) ? moment.unix(Number(date)) : moment(date);
  return d.format(format);
};

/**
* Format date range string
* @param startDate
* @param endDate
* @returns {string}
*/
export const formatDateRange = (startDate: any, endDate: any) => {
  if (!startDate && !endDate) return '';

  const dateFormat = 'DD.MM.YYYY';

  if(!startDate) return `- ${formatDate(endDate, dateFormat)}`;
  if(!endDate) return `${formatDate(startDate, dateFormat)} -`;

  return `${formatDate(startDate, dateFormat)} - ${formatDate(endDate, dateFormat)}`;
};

export const isDecimalNumberStr = (value: any) => (!isEmptyValue(value) && !isNaN(value.toString().replace(',', '.').replace(/\s+/g, '')));

/**
 * get API-url without version suffix
 * @returns {string}
 */
export const getApiUrlWithOutVersionSuffix = () => {
  return process.env.API_URL ? process.env.API_URL.split('/v1')[0] : '';
};

/**
 * Proxied KTJ-link
 * @param id
 * @param key
 * @param lang
 * @returns {string}
 */
export const getKtjLink = (id: number, key: string, lang?: string = 'fi') => {
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
 * Find item from collection with ID
 * @param collection
 * @param id
 * @returns {*}
 */
export const findItemById = (collection: Array<Object>, id: number) => {
  return collection.find((item) => item.id === id);
};

export const getLabelOfOption = (options: Array<Object>, value: any) => {
  if(!options || !options.length || value === undefined || value === null)  return '';

  const option = options.find(x => x.value == value);
  return option ? option.label : '';
};

/**
 * Get full amount of rent
 * @param rents
 */
export const getFullRent = (rents: Array<Object>) => rents.reduce((total, {amount}) => parseFloat(amount) + total, 0);

/**
 * Generate a fraction from float
 * @param float
 */
export const getFractionFromFloat = (float: number) => new Fraction(float).toFraction(true);

/**
 * Get tenants yearly share
 * @param share
 * @param rents
 */
// TODO: Only if the rent-type is fixed (monthly)
export const getTenantsYearlyShare = ({share}: any, rents: Array<Object>) => (getFullRent(rents) * 12) * parseFloat(share);

export const sortNumberByKeyAsc = (a: Object, b: Object, key: string) => {
  const keyA = get(a, key),
    keyB = get(b, key);

  return Number(keyA) - Number(keyB);
};

export const sortNumberByKeyDesc = (a: Object, b: Object, key: string) => {
  const keyA = get(a, key),
    keyB = get(b, key);
  return Number(keyB) - Number(keyA);
};

export const sortStringAsc = (keyA: string, keyB: string) => {
  if(keyA > keyB) return 1;
  if(keyA < keyB) return -1;
  return 0;
};

export const sortStringByKeyAsc = (a: Object, b: Object, key: ?string) => {
  const keyA = key ? get(a, key) ? get(a, key).toLowerCase() : '' : '';
  const keyB = key ? get(b, key) ? get(b, key).toLowerCase() : '' : '';

  return sortStringAsc(keyA, keyB);
};

export const sortStringDesc = (keyA: string, keyB: string) => {
  if(keyA > keyB) return -1;
  if(keyA < keyB) return 1;
  return 0;
};

export const sortStringByKeyDesc = (a: Object, b: Object, key: ?string) => {
  const keyA = key ? get(a, key) ? get(a, key).toLowerCase() : '' : '';
  const keyB = key ? get(b, key) ? get(b, key).toLowerCase() : '' : '';

  return sortStringDesc(keyA, keyB);
};

export const sortByOptionsAsc = (a: Object, b: Object, key: string, options: Array<Object>) => {
  const keyA = a[key] ? getLabelOfOption(options, a[key]) : '',
    keyB = b[key] ? getLabelOfOption(options, b[key]) : '';
  if(keyA > keyB) return 1;
  if(keyA < keyB) return -1;
  return 0;
};

export const sortByOptionsDesc = (a: Object, b: Object, key: string, options: Array<Object>) => {
  const keyA = a[key] ? getLabelOfOption(options, a[key]) : '',
    keyB = b[key] ? getLabelOfOption(options, b[key]) : '';
  if(keyA > keyB) return -1;
  if(keyA < keyB) return 1;
  return 0;
};

export const sortByLabelAsc = (a: Object, b: Object) =>
  sortStringByKeyAsc(a, b, 'label');

export const sortByLabelDesc = (a: Object, b: Object) =>
  sortStringByKeyDesc(a, b, 'label');

const getFileNameByContentDisposition = (contentDisposition) => {
  const regex = /filename[^;=\n]*=(UTF-8(['"]*))?(.*)/;
  const matches = regex.exec(contentDisposition);
  let filename;

  if (matches != null && matches[3]) {
    filename = matches[3].replace(/['"]/g, '');
  }

  return filename ? decodeURI(filename) : null;
};

export const getFileNameFromResponse = (response: any) => {
  const disposition = response.headers.get('content-disposition');
  return getFileNameByContentDisposition(disposition);
};

export const sortByStartAndEndDateDesc = (a: Object, b: Object) => {
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

const selectElementContents = (el) => {
  if (document.createRange && window.getSelection) {
    const range = document.createRange();
    const sel = window.getSelection();
    sel.removeAllRanges();
    try {
      range.selectNodeContents(el);
      sel.addRange(range);
    } catch (e) {
      range.selectNode(el);
      sel.addRange(range);
    }
  }
};

export const copyElementContentsToClipboard = (el: any) => {
  const selection = document.getSelection(),
    selected = selection && selection.rangeCount > 0
      ? selection.getRangeAt(0)
      : false;

  if(!document.body) return false;

  document.body.appendChild(el);
  selectElementContents(el);
  document.execCommand('copy');
  // $FlowFixMe
  document.body.removeChild(el);

  if (selection && selected) {
    selection.removeAllRanges();
    selection.addRange(selected);
  }
  return true;
};

/**
 * Add an empty option to an array
 * @param options
 * @returns {[]}
 */
export const addEmptyOption = (options: Array<Object>) => [{value: '', label: ''}, ...options];

/**
 * Check is field required
 * @param attributes
 * @param field
 * @returns {boolean}
 */

export const isFieldRequired = (attributes: Attributes, field: string) =>
  get(attributes, `${field}.required`) ? true : false;

/**
* Check has user write permissions to field
* @param attributes
* @param field
* @returns {boolean}
*/

export const isFieldAllowedToEdit = (attributes: Attributes, field: string) =>
  get(attributes, `${field}.read_only`) === false ? true : false;

/**
 * Check has user read permissions to field
 * @param attributes
 * @param field
 * @returns {boolean}
 */

export const isFieldAllowedToRead = (attributes: Attributes, field: string) =>
  get(attributes, field) ? true : false;

/**
 * Check has user permission to do action
 * @param permissions
 * @param key
 * @returns {boolean}
 */

export const hasPermissions = (permissions: UsersPermissions, key: string) =>
  permissions && permissions.find((permission) => permission.codename === key) ? true : false;

/**
 * Get options for attribute field
 * @param fieldAttributes
 * @param addEmpty
 * @param optionRenderer
 * @param sortFn
 */
export const getFieldAttributeOptions = (fieldAttributes: Object, addEmpty: boolean = true, optionRenderer?: ?Function, sortFn?: Function) => {
  const options = get(fieldAttributes, `choices`, []).map((item) => ({
    value: item.value,
    label: optionRenderer ? optionRenderer(item) : item.display_name,
  }));

  if(sortFn) {
    options.sort(sortFn);
  }

  if(addEmpty) return addEmptyOption(options);

  return options;
};

/**
 * Get options for attributes by path
 * @param attributes
 * @param path
 * @param addEmpty
 * @param optionRenderer
 * @param sortFn
 */
export const getFieldOptions = (attributes: Attributes, path: string, addEmpty: boolean = true, optionRenderer?: ?Function, sortFn?: Function) => {
  return getFieldAttributeOptions(getFieldAttributes(attributes, path), addEmpty, optionRenderer, sortFn);
};

/**
* Get attributes of a field
* @param attributes
* @param path
* @returns {boolean}
*/

export const getFieldAttributes = (attributes: Attributes, path: string) => get(attributes, path);

/**
* Get file size in human readable format
* @param bytes
* @returns {string}
*/
export const humanReadableByteCount = (bytes: number) => {
  const unit = 1024;
  if (bytes < unit) return `${bytes} B`;

  const exp = Math.floor(Math.log(bytes) / Math.log(unit));
  const pre = `${'KMGTPE'.charAt(exp-1)}B`;
  return `${(bytes / Math.pow(unit, exp)).toFixed(1)} ${pre}`;
};

/**
* Test has string any number
* @param text
* @returns {boolean}
*/
export const hasNumber = (text: string) => /\d/.test(text);

/**
* Try to find value from ocd string and return null if not found
* @param ocd
* @param key
* @returns {string | null}
*/
export const findFromOcdString = (ocd: string, key: string) => {
  const property = ocd.split('/')
    .map((item) => item.split(':'))
    .find((item) => item[0] === key);

  return property && property.length > 1
    ? property[1]
    : null;
};
