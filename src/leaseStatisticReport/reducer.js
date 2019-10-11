// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Reducer, ApiResponse} from '../types';

import type {
  ReceiveAttributesAction,
  ReceiveLeaseInvoicingConfirmationReportAttributesAction,
  ReceiveLeaseInvoicingConfrimationReportsAction,
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

export default combineReducers<Object, any>({
  attributes: attributesReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  leaseInvoicingConfirmationReportAttributes: leaseInvoicingConfirmationReportAttributesReducer,
  isFetchingLeaseInvoicingConfirmationReportAttributes: isFetchingLeaseInvoicingConfirmationReportAttributesReducer,
  isFetchingLeaseInvoicingConfirmationReport: isFetchingLeaseInvoicingConfirmationReportReducer,
  leaseInvoicingConfirmationReport: leaseInvoicingConfirmationReportReducer,
});
