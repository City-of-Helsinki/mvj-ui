// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Reducer, ApiResponse, Reports} from '../types';

import type {
  ReceiveAttributesAction,
  ReceiveLeaseInvoicingConfirmationReportAttributesAction,
  ReceiveLeaseInvoicingConfrimationReportsAction,
  ReceiveReportsAction,
  ReceiveReportDataAction,
  SetOptionsAction,
  SetPayloadAction,
  ReceiveOptionsAction,
} from './types';

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/leaseStatisticReport/FETCH_ATTRIBUTES': () => true,
  'mvj/leaseStatisticReport/RECEIVE_ATTRIBUTES': () => false,
  'mvj/leaseStatisticReport/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/leaseStatisticReport/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, null);

const isFetchingLeaseInvoicingConfirmationReportAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/leaseStatisticReport/FETCH_LEASE_INVOICING_CONFIRMATION_REPORT_ATTRIBUTES': () => true,
  'mvj/leaseStatisticReport/RECEIVE_LEASE_INVOICING_CONFIRMATION_REPORT_ATTRIBUTES': () => false,
  'mvj/leaseStatisticReport/LEASE_INVOICING_CONFIRMATION_REPORT_ATTRIBUTES_ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const leaseInvoicingConfirmationReportAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/leaseStatisticReport/RECEIVE_LEASE_INVOICING_CONFIRMATION_REPORT_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveLeaseInvoicingConfirmationReportAttributesAction) => {
    return attributes;
  },
}, null);

const isFetchingLeaseInvoicingConfirmationReportReducer: Reducer<boolean> = handleActions({
  'mvj/leaseStatisticReport/FETCH_LEASE_INVOICING_CONFIRMATION_REPORTS': () => true,
  'mvj/leaseStatisticReport/RECEIVE_LEASE_INVOICING_CONFIRMATION_REPORTS': () => false,
  'mvj/leaseStatisticReport/NOT_FOUND_LEASE_INVOICING_CONFIRMATION_REPORTS': () => false,
}, false);

const leaseInvoicingConfirmationReportReducer: Reducer<Attributes> = handleActions({
  ['mvj/leaseStatisticReport/RECEIVE_LEASE_INVOICING_CONFIRMATION_REPORTS']: (state: ApiResponse, {payload}: ReceiveLeaseInvoicingConfrimationReportsAction) => {
    return payload;
  },
}, null);

const isFetchingReportsReducer: Reducer<boolean> = handleActions({
  'mvj/leaseStatisticReport/FETCH_REPORTS': () => true,
  'mvj/leaseStatisticReport/RECEIVE_REPORTS': () => false,
  'mvj/leaseStatisticReport/REPORTS_NOT_FOUND': () => false,
}, false);

const reportsReducer: Reducer<Attributes> = handleActions({
  ['mvj/leaseStatisticReport/RECEIVE_REPORTS']: (state: Reports, {payload: reports}: ReceiveReportsAction) => {
    return reports;
  },
}, null);

const isFetchingReportDataReducer: Reducer<boolean> = handleActions({
  'mvj/leaseStatisticReport/FETCH_REPORT_DATA': () => true,
  'mvj/leaseStatisticReport/RECEIVE_REPORT_DATA': () => false,
  'mvj/leaseStatisticReport/REPORT_DATA_NOT_FOUND': () => false,
}, false);

const reportDataReducer: Reducer<Object> = handleActions({
  ['mvj/leaseStatisticReport/RECEIVE_REPORT_DATA']: (state: Reports, {payload: reportData}: ReceiveReportDataAction) => {
    return reportData;
  },
}, null);

const setOptionsReducer: Reducer<Object> = handleActions({
  ['mvj/leaseStatisticReport/SET_REPORT_OPTIONS']: (state: Object, {payload: options}: SetOptionsAction) => {
    return options;
  },
}, null);

const setPayloadReducer: Reducer<Object> = handleActions({
  ['mvj/leaseStatisticReport/SET_PAYLOAD']: (state: Object, {payload: payload}: SetPayloadAction) => {
    return payload;
  },
}, null);

const isSendingMailReducer: Reducer<boolean> = handleActions({
  'mvj/leaseStatisticReport/SEND_REPORT_TO_MAIL': () => true,
  'mvj/leaseStatisticReport/NO_MAIL_SENT': () => false,
  'mvj/leaseStatisticReport/MAIL_SENT': () => false,
}, false);

const isFetchingOptionsReducer: Reducer<boolean> = handleActions({
  'mvj/leaseStatisticReport/FETCH_OPTIONS': () => true,
  'mvj/leaseStatisticReport/RECEIVE_OPTIONS': () => false,
  'mvj/leaseStatisticReport/OPTIONS_NOT_FOUND': () => false,
}, false);

const optionsReducer: Reducer<Attributes> = handleActions({
  ['mvj/leaseStatisticReport/RECEIVE_OPTIONS']: (state: Object, {payload: options}: ReceiveOptionsAction) => {
    return options;
  },
}, null);

export default combineReducers<Object, any>({
  attributes: attributesReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  leaseInvoicingConfirmationReportAttributes: leaseInvoicingConfirmationReportAttributesReducer,
  isFetchingLeaseInvoicingConfirmationReportAttributes: isFetchingLeaseInvoicingConfirmationReportAttributesReducer,
  isFetchingLeaseInvoicingConfirmationReport: isFetchingLeaseInvoicingConfirmationReportReducer,
  leaseInvoicingConfirmationReport: leaseInvoicingConfirmationReportReducer,
  reports: reportsReducer,
  isFetchingReports: isFetchingReportsReducer,
  reportData: reportDataReducer,
  isFetchingReportData: isFetchingReportDataReducer,
  reportOptions: setOptionsReducer,
  payload: setPayloadReducer,
  isSendingMail: isSendingMailReducer,
  isFetchingOptions: isFetchingOptionsReducer,
  options: optionsReducer,
});
