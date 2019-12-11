// @flow
import type {Action, Attributes, ApiResponse} from '../types';

export type LeaseStatisticReportState = {
  attributes: Attributes,
  isFetchingAttributes: boolean,
  leaseInvoicingConfirmationReportAttributes: Attributes,
  isFetchingLeaseInvoicingConfirmationReportAttributes: boolean,
  leaseInvoicingConfirmationReport: ApiResponse,
  isFetchingLeaseInvoicingConfirmationReport: boolean,
};

export type LeaseInvoicingConfirmationReport = ApiResponse;

export type FetchAttributesAction = Action<'mvj/leaseStatisticReport/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/leaseStatisticReport/RECEIVE_ATTRIBUTES', Attributes>;
export type AttributesNotFoundAction = Action<'mvj/leaseStatisticReport/ATTRIBUTES_NOT_FOUND', void>;

export type FetchLeaseInvoicingConfirmationReportAttributesAction = Action<'mvj/leaseStatisticReport/FETCH_LEASE_INVOICING_CONFIRMATION_REPORT_ATTRIBUTES', void>;
export type ReceiveLeaseInvoicingConfirmationReportAttributesAction = Action<'mvj/leaseStatisticReport/RECEIVE_LEASE_INVOICING_CONFIRMATION_REPORT_ATTRIBUTES', Attributes>;
export type LeaseInvoicingConfirmationReportAttributesNotFoundAction = Action<'mvj/leaseStatisticReport/LEASE_INVOICING_CONFIRMATION_REPORT_ATTRIBUTES_ATTRIBUTES_NOT_FOUND', void>;

export type FetchLeaseInvoicingConfrimationReportsAction = Action<'mvj/leaseStatisticReport/FETCH_LEASE_INVOICING_CONFIRMATION_REPORTS', void>;
export type ReceiveLeaseInvoicingConfrimationReportsAction = Action<'mvj/leaseStatisticReport/RECEIVE_LEASE_INVOICING_CONFIRMATION_REPORTS', Object>;
export type NotFoundLeaseInvoicingConfrimationReportsAction = Action<'mvj/leaseStatisticReport/NOT_FOUND_LEASE_INVOICING_CONFIRMATION_REPORTS', void>;
