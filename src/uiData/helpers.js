// @flow
import {UiDataPrefixes} from '$src/uiData/enums';

import type {UiDataList} from './types';

/*
* Return value of ui data object by key
* @param {string} prefix
* @param {string} key
* @return {string}
*/
export const getKeyWithPrefix = (prefix: string, key?: string) => key ? `${prefix}.${key}` : prefix;

/*
* Get key for ui data on coolection lettercollection court decision section
* @param {string} key
* @return {string}
*/
export const getUiDataCollectionCourtDecisionKey = (key: string) => getKeyWithPrefix(UiDataPrefixes.COLLECTION_COURT_DECISION, key);

/*
* Get key for ui data on collection letter section
* @param {string} key
* @return {string}
*/
export const getUiDataCollectionLetterKey = (key: string) => getKeyWithPrefix(UiDataPrefixes.COLLECTION_LETTER, key);

/*
* Get key for ui data on collection note section
* @param {string} key
* @return {string}
*/
export const getUiDataCollectionNoteKey = (key: string) => getKeyWithPrefix(UiDataPrefixes.COLLECTION_NOTE, key);

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
* Get key for ui data on create charge panel
* @param {string} key
* @return {string}
*/
export const getUiDataCreateChargeKey = (key: string) => getKeyWithPrefix(UiDataPrefixes.CREATE_CHARGE, key);

/*
* Get key for ui data on create collection letter section
* @param {string} key
* @return {string}
*/
export const getUiDataCreateCollectionLetterKey = (key: string) => getKeyWithPrefix(UiDataPrefixes.CREATE_COLLECTION_LETTER, key);

/*
* Get key for ui data on credit invoice panel
* @param {string} key
* @return {string}
*/
export const getUiDataCreditInvoiceKey = (key: string) => getKeyWithPrefix(UiDataPrefixes.CREDIT_INVOICE, key);

/*
* Get key for ui data on lease invoice tab
* @param {string} key
* @return {string}
*/
export const getUiDataInvoiceKey = (key: string) => getKeyWithPrefix(UiDataPrefixes.INVOICE, key);

/*
* Get key for ui data on lease page
* @param {string} key
* @return {string}
*/
export const getUiDataLeaseKey = (key: string) => getKeyWithPrefix(UiDataPrefixes.LEASE, key);

/*
* Get key for ui data on lease page
* @param {string} key
* @return {string}
*/
export const getUiDataPenaltyInterestKey = (key: string) => getKeyWithPrefix(UiDataPrefixes.PENALTY_INTEREST, key);

/*
* Get key for ui data on related lease section
* @param {string} key
* @return {string}
*/
export const getUiDataRelatedLeaseKey = (key: string) => getKeyWithPrefix(UiDataPrefixes.RELATED_LEASE, key);

/*
* Get key for ui data on rent basis section
* @param {string} key
* @return {string}
*/
export const getUiDataRentBasisKey = (key: string) => getKeyWithPrefix(UiDataPrefixes.RENT_BASIS, key);

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
