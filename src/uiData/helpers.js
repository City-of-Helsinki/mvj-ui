// @flow
import {UiDataPrefixes} from '$src/uiData/enums';

import type {UiDataList} from './types';

/*
* Return value of ui data object by key
* @param {string} prefix
* @param {string} key
* @return {string}
*/
export const getKeyWithPrefix = (prefix: string, key: string) => `${prefix}.${key}`;

/*
* Get key for ui data on lease comment panel
* @param {string} key
* @return {string}
*/
export const getUiDataCommentKey = (key: string) => getKeyWithPrefix(UiDataPrefixes.COMMENT, key);

/*
* Get key for ui data on contact page
* @param {string} key
* @return {string}
*/
export const getUiDataContactKey = (key: string) => getKeyWithPrefix(UiDataPrefixes.CONTACT, key);

/*
* Get key for ui data on lease page
* @param {string} key
* @return {string}
*/
export const getUiDataLeaseKey = (key: string) => getKeyWithPrefix(UiDataPrefixes.LEASE, key);

/*
* Return value of ui data object by key
* @param {Object[]} uiDataList
* @param {string} key
* @return {string|null}
*/
export const getUiDataByKey = (uiDataList: UiDataList, key: string) => {
  const uiData = uiDataList.find((item) => {
    return item.key === key;
  });

  return uiData ? uiData : null;
};
