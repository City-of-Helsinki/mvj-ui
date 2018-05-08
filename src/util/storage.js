// @flow
import get from 'lodash/get';
import isString from 'lodash/isString';

/* global STORAGE_PREFIX */

/**
 *
 * @param {string} key
 */
export const getStorageItem = (key: string) => {
  const [root, ...rest] = key.split('.');
  const item = localStorage.getItem(buildStorageKey(root)) || '';
  const value = isJson(item) ? JSON.parse(item) : item;
  return rest.length ? get(value, rest.join('.')) : value;
};

/**
 *
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
 *
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
 *
 * @param {string} key
 * @returns {string}
 */
const buildStorageKey = (key: string) => {
  // $FlowFixMe
  return [STORAGE_PREFIX, key].join('.');
};

/**
 *
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
