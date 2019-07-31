// @flow
import React from 'react';
import formatDateStr from 'date-fns/format';
import isFuture from 'date-fns/isFuture';
import isPast from 'date-fns/isPast';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import {toastr} from 'react-redux-toastr';

import ToastrIcons from '$components/toastr/ToastrIcons';
import {PAIKKATIETOVIPUNEN_URL} from '$src/constants';
import {Breakpoints} from '$src/foundation/enums';
import {isContactFormDirty} from '$src/contacts/helpers';
import {isInfillDevelopmentFormDirty} from '$src/infillDevelopment/helpers';
import {isAnyLandUseContractFormDirty} from '$src/landUseContract/helpers';
import {isAnyLeaseFormDirty} from '$src/leases/helpers';
import {isRentBasisFormDirty} from '$src/rentbasis/helpers';
import {store} from '$src/root/startApp';

import type {ApiResponse, Attributes, Methods} from '$src/types';
import type {UsersPermissions} from '$src/usersPermissions/types';

/**
 * Compose page title
 * @param {string} title
 * @param {boolean} presend
 * @returns {string}
 */
export const composePageTitle = (title: string = '', prepend?: boolean = true): string => {
  return prepend ? `${title ? `${title} | ` : ''}Maanvuokrausjärjestelmä | Helsingin Kaupunki` : title;
};

/**
 * Set page title
 * @param [string] title
 * @param [boolean] presend
 */
export const setPageTitle = (title: string, prepend?: boolean) => {
  document.title = composePageTitle(title, prepend);
};

/**
 * Get width of the document
 * @returns {number}
 */
export const getDocumentWidth = (): number => {
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
 * Get foundation breakpoint
 * @returns {string}
 */
export const getFoundationBreakpoint = (): string => {
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
 * Test is the screen size large
 * @returns {boolean}
 */
export const isLargeScreen = (): boolean => {
  const breakpoint = getFoundationBreakpoint();

  switch (breakpoint) {
    case Breakpoints.SMALL:
    case Breakpoints.MEDIUM:
      return false;
    default:
      return true;
  }
};

/**
 * Scroll to the top of the page
 */
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

/**
 * Get search query as string
 * @param {*} filters
 * @returns {string}
 */
export const getSearchQuery = (filters: any): string => {
  let query = [];

  forEach(filters, (filter: any, key) => {
    if (filter != null && (!isEmpty(filter) || isNumber(filter) || typeof 'boolean')) {
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

      // $FlowFixMe
      query.push(`${key}=${isArray(filter) ? filter.join(',') : encodeURIComponent(filter)}`);
    }
  });

  return query.length ? `?${query.join('&')}` : '';
};

/**
 * Get url parameters from search string
 * @param {string} string
 * @returns {Object}
 */
export const getUrlParams = (search: string = ''): Object => {
  const query = {};
  const entries = search.replace('?', '').split('&');

  entries.forEach((entry) => {
    const split = entry.split('=');
    const key = decodeURIComponent(split[0]);
    const values = decodeURIComponent(split[1]).split(',');

    if(!key) return;

    if(query[key]) {
      if(isArray(query[key])) {
        query[key].push(values);
      } else {
        query[key] = [query[key], ...values];
      }
    } else {
      query[key] = values.length === 1 ? values[0] : values;
    }
  });

  return query;
};

/**
 * Display message in UI
 * @param {Object} message - Title and the body of the message
 * @param {Object} opts - Options
 */
export const displayUIMessage = (message: Object, opts?: Object = {type: 'success'}) => {
  const {title, body} = message;
  const icon = <ToastrIcons name={opts.type} />;

  return toastr[opts.type](title, body, {...opts, icon: icon});
};

/**
 * Format number to fixed length
 * @param {number} value
 * @param {number} length
 * @returns {string}
 */
export const fixedLengthNumber = (value: ?number, length: number = 2): string => {
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

/**
 * Get current epoch time
 * @returns {number}
 */
export const getEpochTime = (): number => Math.round(new Date().getTime()/1000.0);

/**
 * Test is value empty or null/undefined
 * @param {*} value
 * @returns {number}
 */
export const isEmptyValue = (value: any): boolean => (value == null || value === '');

/**
 * Format number with thousand separator
 * @param {*} x
 * @param {string} separator
 * @returns {string}
 */
export const formatNumberWithThousandSeparator = (x: any, separator?: string = ' '): string => 
  !isEmptyValue(x) ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator) : '';

/**
 * Format decimal number
 * @param {number} x
 * @returns {string}
 */
export const formatDecimalNumber = (x: ?number): ?string => 
  !isEmptyValue(x) ? parseFloat(x).toFixed(2).toString().replace('.', ',') : null;

/**
 * Format number to show on UI
 * @param {*} x
 * @returns {string}
 */
export const formatNumber = (x: any): string => 
  !isEmptyValue(x) ? formatNumberWithThousandSeparator(formatDecimalNumber(x)) : '';

/**
 * Convert string to a decimal number
 * @param {*} x
 * @returns {number}
 */
export const convertStrToDecimalNumber = (x: any): ?number => 
  isEmptyValue(x) ? null : Number(x.toString().replace(',', '.').replace(/\s+/g, ''));

/**
* Format date string
* @param {string} date
* @param {string} format
* @returns {string}
*/
export const formatDate = (date: any, format?: string = 'dd.MM.yyyy'): ?string => {
  if (!date) return null;

  const d = isNumber(date) ? date : new Date(date);
  return formatDateStr(d, format);
};

/**
* Format date range string
* @param {string} startDate
* @param {string} endDate
* @returns {string}
*/
export const formatDateRange = (startDate: any, endDate: any): string => {
  if (!startDate && !endDate) return '';

  const dateFormat = 'dd.MM.yyyy';

  if(!startDate) return `–${formatDate(endDate, dateFormat) || ''}`;
  if(!endDate) return `${formatDate(startDate, dateFormat) || ''}–`;

  return `${formatDate(startDate, dateFormat) || ''}–${formatDate(endDate, dateFormat) || ''}`;
};

/**
 * Test is is possible to convert string to a decimal number
 * @param {*} value
 * @returns {boolean}
 */
export const isDecimalNumberStr = (value: any): boolean => 
  (!isEmptyValue(value) && !isNaN(value.toString().replace(',', '.').replace(/\s+/g, '')));

/**
 * get API-url without version suffix
 * @returns {string}
 */
export const getApiUrlWithOutVersionSuffix = () => {
  return process.env.API_URL ? process.env.API_URL.split('/v1')[0] : '';
};

/**
 * Get reference number link from Päätökset
 * @param referenceNumber
 * @returns {string}
 */
export const getReferenceNumberLink = (referenceNumber: ?string): ?string => {
  const apiUrl = 'https://dev.hel.fi/paatokset/asia';

  return referenceNumber ? `${apiUrl}/${referenceNumber.replace(' ', '-').toLowerCase()}` : null;
};

/**
 * Find item from collection with ID
 * @param {Object[]} collection
 * @param {number} id
 * @returns {Object}
 */
export const findItemById = (collection: Array<Object>, id: number): ?Object => 
  collection.find((item) => item.id === id);

/**
 * Get label of an option
 * @param {Object[]} options
 * @param {*} value
 * @returns {string}
 */
export const getLabelOfOption = (options: Array<Object>, value: any): string => 
  (options || value != null)
    ? get(options.find(x => x.value == value), 'label', '')
    : '';

/**
 * Sort objects in ascending numerical order by key
 * @param {Object} a
 * @param {Object} b
 * @param {key} string
 * @returns {number}
 */
export const sortNumberByKeyAsc = (a: Object, b: Object, key: string): number => {
  const keyA = get(a, key),
    keyB = get(b, key);

  return Number(keyA) - Number(keyB);
};

/**
 * Sort objects in descending numerical order by key
 * @param {Object} a
 * @param {Object} b
 * @param {key} string
 * @returns {number}
 */
export const sortNumberByKeyDesc = (a: Object, b: Object, key: string): number => {
  const keyA = get(a, key),
    keyB = get(b, key);

  return Number(keyB) - Number(keyA);
};

/**
 * Sort strings in ascending order
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export const sortStringAsc = (a: string, b: string): number => {
  if(a > b) return 1;
  if(a < b) return -1;
  return 0;
};

/**
 * Sort objects in ascending order by key
 * @param {Object} a
 * @param {Object} b
 * @param {key} string
 * @returns {number}
 */
export const sortStringByKeyAsc = (a: Object, b: Object, key: string): number => {
  const valA = (get(a, key) || '').toLowerCase();
  const valB = (get(b, key) || '').toLowerCase();

  return sortStringAsc(valA, valB);
};

/**
 * Sort strings in descending order
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export const sortStringDesc = (a: string, b: string): number => {
  if(a > b) return -1;
  if(a < b) return 1;
  return 0;
};

/**
 * Sort objects in descending order by key
 * @param {Object} a
 * @param {Object} b
 * @param {key} string
 * @returns {number}
 */
export const sortStringByKeyDesc = (a: Object, b: Object, key: string): number => {
  const valA = (get(a, key) || '').toLowerCase();
  const valB = (get(b, key) || '').toLowerCase();

  return sortStringDesc(valA, valB);
};

/**
 * Sort objects in ascending order by key
 * @param {Object} a
 * @param {Object} b
 * @param {key} string
 * @param {Object[]} options
 * @returns {number}
 */
export const sortByOptionsAsc = (a: Object, b: Object, key: string, options: Array<Object>): number => {
  const valA = a[key] ? getLabelOfOption(options, a[key]) : '',
    valB = b[key] ? getLabelOfOption(options, b[key]) : '';

  return sortStringAsc(valA, valB);
};

/**
 * Sort objects in descending order by key
 * @param {Object} a
 * @param {Object} b
 * @param {key} string
 * @param {Object[]} options
 * @returns {number}
 */
export const sortByOptionsDesc = (a: Object, b: Object, key: string, options: Array<Object>) => {
  const valA = a[key] ? getLabelOfOption(options, a[key]) : '',
    valB = b[key] ? getLabelOfOption(options, b[key]) : '';

  return sortStringAsc(valA, valB);
};

/**
 * Get filename from content-disposition header
 * @param {*} contentDisposition
 * @returns {string | null}
 */
const getFilenameFromContentDisposition = (contentDisposition: any): ?string => {
  const regex = /filename[^;=\n]*=(UTF-8(['"]*))?(.*)/;
  const matches = regex.exec(contentDisposition);
  let filename;

  if (matches != null && matches[3]) {
    filename = matches[3].replace(/['"]/g, '');
  }

  return filename ? decodeURI(filename) : null;
};

/**
 * Get filename from api response
 * @param {*} response
 * @returns {string | null}
 */
export const getFileNameFromResponse = (response: any) => 
  getFilenameFromContentDisposition(response.headers.get('content-disposition'));

/**
 * Select contents of an element
 * @param {*} el
 */
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

/**
 * Copy element content to clipboard
 * @param {*} el
 * @returns {boolean}
 */
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
 * Add an empty option to options
 * @param {Object[]} options
 * @returns {Object[]}
 */
export const addEmptyOption = (options: Array<Object>): Array<Object> => 
  [{value: '', label: ''}, ...options];

/**
 * Test is field required
 * @param {Object} attributes
 * @param {string} field
 * @returns {boolean}
 */
export const isFieldRequired = (attributes: Attributes, field: string): boolean =>
  get(attributes, `${field}.required`) ? true : false;

/**
 * Test has user edit permissions to field
 * @param {Object} attributes
 * @param {string} field
 * @returns {boolean}
 */
export const isFieldAllowedToEdit = (attributes: Attributes, field: string): boolean =>
  get(attributes, `${field}.read_only`) === false ? true : false;

/**
 * Test has user read permissions to field
 * @param {Object} attributes
 * @param {string} field
 * @returns {boolean}
 */
export const isFieldAllowedToRead = (attributes: Attributes, field: string): boolean =>
  get(attributes, field) ? true : false;

/**
 * Test has user permission to a method
 * @param {Object} methods
 * @param {string} method
 * @returns {boolean}
 */
export const isMethodAllowed = (methods: Methods, method: string): boolean =>
  get(methods, method) ? true : false;

/**
 * Check has user permission to do action
 * @param permissions
 * @param key
 * @returns {boolean}
 */
export const hasPermissions = (permissions: UsersPermissions, key: string): boolean =>
  permissions && permissions.find((permission) => permission.codename === key) ? true : false;

/**
 * Get options for attribute field
 * @param {Object} fieldAttributes
 * @param {boolean} addEmpty
 * @param {function} optionRenderer
 * @param {function} sortFn
 * @returns {Object[]}
 */
export const getFieldAttributeOptions = (fieldAttributes: Object, addEmpty: boolean = true, optionRenderer?: ?Function, sortFn?: Function): Array<Object> => {
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
 * @param {Object} attributes
 * @param {string} path
 * @param {boolean} addEmpty
 * @param {function} optionRenderer
 * @param {function} sortFn
 * @returns {Object[]}
 */
export const getFieldOptions = (attributes: Attributes, path: string, addEmpty: boolean = true, optionRenderer?: ?Function, sortFn?: Function): Array<Object> => {
  return getFieldAttributeOptions(getFieldAttributes(attributes, path), addEmpty, optionRenderer, sortFn);
};

/**
 * Get attributes of a field
 * @param {Object} attributes
 * @param {string} path
 * @returns {Object}
 */

export const getFieldAttributes = (attributes: Attributes, path: string): ?Object => 
  get(attributes, path);

/**
 * Get file size in human readable format
 * @param {number} bytes
 * @returns {string}
 */
export const humanReadableByteCount = (bytes: number): string => {
  const unit = 1024;
  if (bytes < unit) return `${bytes} B`;

  const exp = Math.floor(Math.log(bytes) / Math.log(unit));
  const pre = `${'KMGTPE'.charAt(exp-1)}B`;
  return `${(bytes / Math.pow(unit, exp)).toFixed(1)} ${pre}`;
};

/**
 * Test has string any number
 * @param {string} text
 * @returns {boolean}
 */
export const hasNumber = (text: string): boolean => 
  /\d/.test(text);

/**
 * Try to find value from ocd string and return null if not found
 * @param {string} ocd
 * @param {string} key
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

/**
 * Create url to paikkatietovipunen
 * @param {string} url
 * @returns {string}
 */
export const createPaikkatietovipunenUrl = (url: string): string => 
  `${PAIKKATIETOVIPUNEN_URL}/${url}`;


/**
 * Get count of results from api response
 * @param {Object} response
 * @returns {number}
 */
export const getApiResponseCount = (response: ApiResponse): number => 
  get(response, 'count', 0);

/**
 * Get maximum number of pages from api response
 * @param {Object} response
 * @param {number} size
 * @returns {number}
 */
export const getApiResponseMaxPage = (response: ApiResponse, size: number): number => {
  const count = getApiResponseCount(response);

  return Math.ceil(count/size);
};

/**
 * Get results from api response
 * @param {Object} response
 * @returns {Object[]}
 */
export const  getApiResponseResults = (response: ApiResponse) => 
  get(response, 'results', []);

/**
 * Get React component by dom id
 * @param {string} id
 * @returns {Object}
 */
export const findReactById = (id: ?string): ?Object => {
  if(!id) return null;

  const dom = document.getElementById(id);

  if(!dom) return null;

  const key = Object.keys(dom).find(key=>key.startsWith('__reactInternalInstance$'));
  // $FlowFixMe
  const internalInstance = dom[key];
  if (internalInstance == null) return null;

  if (internalInstance.return) { // react 16+
    return internalInstance._debugOwner
      ? internalInstance._debugOwner.stateNode
      : internalInstance.return.stateNode;
  } else { // react <16
    return internalInstance._currentElement._owner._instance;
  }
};

/**
 * Test is item active
 * @param {Object} item
 * @returns {boolean}
 */
export const isActive = (item: ?Object): boolean => {
  const startDate = get(item, 'start_date', '0000-01-01');
  const endDate = get(item, 'end_date', '9999-12-31');

  if((startDate && isFuture(new Date(startDate))) || (endDate && isPast(new Date(endDate)))) {
    return false;
  }

  return true;
};

/**
 * Test is item archived
 * @param {Object} item
 * @returns {boolean}
 */
export const isArchived = (item: ?Object): boolean => {
  const endDate = get(item, 'end_date', '9999-12-31');

  if(isPast(new Date(endDate))) {
    return true;
  }

  return false;
};

/**
 * Test has any page dirty forms
 * @enum {boolean}
 */
export const hasAnyPageDirtyForms = (): boolean => {
  const state = store.getState(),
    isContactDirty = isContactFormDirty(state),
    isInfillDevelopmentDirty = isInfillDevelopmentFormDirty(state),
    isLandUseContractDirty = isAnyLandUseContractFormDirty(state),
    isLeaseDirty = isAnyLeaseFormDirty(state),
    isRentBasisDirty = isRentBasisFormDirty(state);

  return isContactDirty ||
    isInfillDevelopmentDirty ||
    isLandUseContractDirty ||
    isLeaseDirty ||
    isRentBasisDirty;
};
