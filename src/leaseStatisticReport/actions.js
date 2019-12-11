// @flow
import {createAction} from 'redux-actions';

import type {Attributes} from '$src/types';
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  AttributesNotFoundAction,
  FetchLeaseInvoicingConfirmationReportAttributesAction,
  ReceiveLeaseInvoicingConfirmationReportAttributesAction,
  LeaseInvoicingConfirmationReportAttributesNotFoundAction,
  FetchLeaseInvoicingConfrimationReportsAction,
  NotFoundLeaseInvoicingConfrimationReportsAction,
  ReceiveLeaseInvoicingConfrimationReportsAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/leaseStatisticReport/FETCH_ATTRIBUTES')();
  
export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/leaseStatisticReport/RECEIVE_ATTRIBUTES')(attributes);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/leaseStatisticReport/ATTRIBUTES_NOT_FOUND')();

export const fetchLeaseInvoicingConfirmationReportAttributes = (): FetchLeaseInvoicingConfirmationReportAttributesAction =>
  createAction('mvj/leaseStatisticReport/FETCH_LEASE_INVOICING_CONFIRMATION_REPORT_ATTRIBUTES')();

export const receiveLeaseInvoicingConfirmationReportAttributes = (attributes: Attributes): ReceiveLeaseInvoicingConfirmationReportAttributesAction =>
  createAction('mvj/leaseStatisticReport/RECEIVE_LEASE_INVOICING_CONFIRMATION_REPORT_ATTRIBUTES')(attributes);
  
export const leaseInvoicingConfirmationReportAttributesNotFound = (): LeaseInvoicingConfirmationReportAttributesNotFoundAction =>
  createAction('mvj/leaseStatisticReport/LEASE_INVOICING_CONFIRMATION_REPORT_ATTRIBUTES_ATTRIBUTES_NOT_FOUND')();

export const fetchLeaseInvoicingConfrimationReports = (query: Object): FetchLeaseInvoicingConfrimationReportsAction =>
  createAction('mvj/leaseStatisticReport/FETCH_LEASE_INVOICING_CONFIRMATION_REPORTS')(query);

export const receiveLeaseInvoicingConfrimationReports = (runs: Object): ReceiveLeaseInvoicingConfrimationReportsAction =>
  createAction('mvj/leaseStatisticReport/RECEIVE_LEASE_INVOICING_CONFIRMATION_REPORTS')(runs);

export const notFoundLeaseInvoicingConfrimationReports = (): NotFoundLeaseInvoicingConfrimationReportsAction =>
  createAction('mvj/leaseStatisticReport/NOT_FOUND_LEASE_INVOICING_CONFIRMATION_REPORTS')();
