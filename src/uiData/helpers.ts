import { UiDataPrefixes } from "src/uiData/enums";
import type { UiDataList } from "./types";

/**
 * Return value of ui data object by key
 * @param {string} prefix
 * @param {string} key
 * @return {string}
 */
export const getKeyWithPrefix = (prefix: string, key?: string): string => key ? `${prefix}.${key}` : prefix;

/**
 * Get key for ui data on coolection lettercollection court decision section
 * @param {string} key
 * @return {string}
 */
export const getUiDataCollectionCourtDecisionKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.COLLECTION_COURT_DECISION, key);

/**
 * Get key for ui data on collection letter section
 * @param {string} key
 * @return {string}
 */
export const getUiDataCollectionLetterKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.COLLECTION_LETTER, key);

/**
 * Get key for ui data on collection note section
 * @param {string} key
 * @return {string}
 */
export const getUiDataCollectionNoteKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.COLLECTION_NOTE, key);

/**
 * Get key for ui data on lease comment panel
 * @param {string} key
 * @return {string}
 */
export const getUiDataCommentKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.COMMENT, key);

/**
 * Get key for ui data on contact page
 * @param {string} key
 * @return {string}
 */
export const getUiDataContactKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.CONTACT, key);

/**
 * Get key for ui data on create charge panel
 * @param {string} key
 * @return {string}
 */
export const getUiDataCreateChargeKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.CREATE_CHARGE, key);

/**
 * Get key for ui data on create collection letter section
 * @param {string} key
 * @return {string}
 */
export const getUiDataCreateCollectionLetterKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.CREATE_COLLECTION_LETTER, key);

/**
 * Get key for ui data on credit invoice panel
 * @param {string} key
 * @return {string}
 */
export const getUiDataCreditInvoiceKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.CREDIT_INVOICE, key);

/**
 * Get key for ui data on infll development compensation page
 * @param {string} key
 * @return {string}
 */
export const getUiDataInfillDevelopmentKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.INFILL_DEVELOPMENT, key);

/**
 * Get key for ui data on infll development compensation attachment section
 * @param {string} key
 * @return {string}
 */
export const getUiDataInfillDevelopmentAttachmentKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.INFILL_DEVELOPMENT_ATTACHMENT, key);

/**
 * Get key for ui data on lease invoice tab
 * @param {string} key
 * @return {string}
 */
export const getUiDataInvoiceKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.INVOICE, key);

/**
 * Get key for ui data on lease page
 * @param {string} key
 * @return {string}
 */
export const getUiDataLeaseKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.LEASE, key);

/**
 * Get key for ui data on plot search page
 * @param {string} key
 * @return {string}
 */
export const getUiDataPlotSearchKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.PLOT_SEARCH, key);

/**
 * Get key for ui data on land use contract page
 * @param {string} key
 * @return {string}
 */
export const getUiDataLandUseContractKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.LAND_USE_CONTRACT, key);

/**
 * Get key for ui data on property page
 * @param {string} key
 * @return {string}
 */
export const getUiDataPropertyKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.PROPERTY, key);

/**
 * Get key for ui data on lease page
 * @param {string} key
 * @return {string}
 */
export const getUiDataPenaltyInterestKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.PENALTY_INTEREST, key);

/**
 * Get key for ui data on related lease section
 * @param {string} key
 * @return {string}
 */
export const getUiDataRelatedLeaseKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.RELATED_LEASE, key);

/**
 * Get key for ui data on rent basis section
 * @param {string} key
 * @return {string}
 */
export const getUiDataRentBasisKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.RENT_BASIS, key);

/**
 * Get key for ui data on rent calculator section
 * @param {string} key
 * @return {string}
 */
export const getUiDataRentCalculatorKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.RENT_CALCULATOR, key);

/**
 * Get key for ui data on trade register company extended component
 * @param {string} key
 * @return {string}
 */
export const getUiDataTradeRegisterCompanyExtendedKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.TRADE_REGISTER_COMPANY_EXTENDED, key);

/**
 * Get key for ui data on trade register company notice component
 * @param {string} key
 * @return {string}
 */
export const getUiDataTradeRegisterCompanyNoticeKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.TRADE_REGISTER_COMPANY_NOTICE, key);

/**
 * Get key for ui data on trade register company notice component
 * @param {string} key
 * @return {string}
 */
export const getUiDataTradeRegisterCompanyRepresentKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.TRADE_REGISTER_COMPANY_REPRESENT, key);

/**
 * Get key for ui data on trade register company notice component
 * @param {string} key
 * @return {string}
 */
export const getUiDataLandUseAgreementAttachmentKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.LAND_USE_CONTRACT_AGREEMENT_ATTACHMENT, key);

/**
 * Get key for ui data on credit decision component
 * @param {string} key
 * @return {string}
 */
export const getUiDataCreditDecisionKey = (key: string): string => getKeyWithPrefix(UiDataPrefixes.CREDIT_DECISION, key);

/**
 * Return value of ui data object by key
 * @param {Object[]} uiDataList
 * @param {string} key
 * @return {string|null}
 */
export const getUiDataByKey = (uiDataList: UiDataList, key: string): Record<string, any> | string | null | undefined => {
  const uiData = uiDataList.find(item => {
    return item.key === key;
  });
  return uiData ? uiData : null;
};