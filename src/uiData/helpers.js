// @flow

import type {UiDataList} from './types';

/*
* Return value of ui data object by key
* @param {string} prefix
* @param {string} key
* @return {string}
*/
export const getKeyWithPrefix = (prefix: string, key: string) => `${prefix}.${key}`;

/*
* Return value of ui data object by key
* @param {Object[]} uiDataList
* @param {string} key
* @return {string|null}
*/
export const getUiDataValue = (uiDataList: UiDataList, key: string) => {
  const uiData = uiDataList.find((item) => {
    console.log(item.key, key);
    return item.key === key;
  });

  console.log(uiDataList, uiData, key);
  return uiData ? uiData.value : null;
};
