// @flow
import get from 'lodash/get';
import isString from 'lodash/isString';

/**
 * Get item from the local storage
 * @param {string} key
 * @returns {*}
 */
export const getStorageItem = (key: string): string | null => {
  const [root, ...rest] = key.split('.');
  const item = localStorage.getItem(buildStorageKey(root)) || '';
  const value = isJson(item) ? JSON.parse(item) : item;
  return rest.length ? get(value, rest.join('.')) : value;
};

/**
 * Add item to the local storage
 * @param {string} key
 * @param {*} value
 * @param callback
 */
export const setStorageItem = (key: string, value: any, callback: ?Function = null) => {
  if (!isString(value)) {
    value = JSON.stringify(value);
  }
  try {
    localStorage.setItem(buildStorageKey(key), value);
    if (callback && typeof callback === 'function') {
      callback();
    }
  } catch (e) {
    // fall silently
  }
};

/**
 * Remove item from the local storage
 * @param {string} key
 * @param callback
 */
export const removeStorageItem = (key: string, callback: ?Function = null) => {
  localStorage.removeItem(buildStorageKey(key));
  if (callback && typeof callback === 'function') {
    callback();
  }
};

/**
 * Get item from the session storage
 * @param {string} key
 * @returns {*}
 */
export const getSessionStorageItem = (key: string): any => {
  const item = sessionStorage.getItem(key) || '';
  const value = isJson(item) ? JSON.parse(item) : item;
  return value;
};

/**
 * Add item to the session storage
 * @param {string} key
 * @param {*} value
 * @param callback
 */
export const setSessionStorageItem = (key: string, value: any, callback: ?Function = null) => {
  if (!isString(value)) {
    value = JSON.stringify(value);
  }
  try {
    sessionStorage.setItem(key, value);
    if (callback && typeof callback === 'function') {
      callback();
    }
  } catch (e) {
    // fall silently
  }
};

/**
 * Remove item from the session storage
 * @param {string} key
 * @param callback
 */
export const removeSessionStorageItem = (key: string, callback: ?Function = null) => {
  sessionStorage.removeItem(key);
  if (callback && typeof callback === 'function') {
    callback();
  }
};

/**
 * Add storage prefix to a key
 * @param {string} key
 * @returns {string}
 */
const buildStorageKey = (key: string) => {
  return [process.env.STORAGE_PREFIX, key].join('.');
};

/**
 * Test is value possible to parse to JSON
 * @param {*} value
 * @returns {boolean}
 */
const isJson = (value: any) => {
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }
  return true;
};

/**
 * Get redirect address stored to session storage
 * @returns {string}
 */
export const getRedirectUrlFromSessionStorage = (): any => {
  return getSessionStorageItem('redirectURL');
};

/**
 * Set redirect address to session storage
 * @param {string} url
 */
export const setRedirectUrlToSessionStorage = (url: string) => {
  setSessionStorageItem('redirectURL', url);
};
