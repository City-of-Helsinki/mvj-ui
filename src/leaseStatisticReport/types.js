// @flow
import type {Action, Attributes, ApiResponse, Reports} from '../types';

export type LeaseStatisticReportState = {
  attributes: Attributes,
  isFetchingAttributes: boolean,
  leaseInvoicingConfirmationReportAttributes: Attributes,
  isFetchingLeaseInvoicingConfirmationReportAttributes: boolean,
  leaseInvoicingConfirmationReport: ApiResponse,
  isFetchingLeaseInvoicingConfirmationReport: boolean,
  reports: Reports,
  isFetchingReports: boolean,
  reportData: Object,
  isFetchingReportData: boolean,
  reportOptions: Object,
  isSendingMail: boolean,
  options: Object,
  isFetchingOptions: boolean,
  payload: Object,
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

export type FetchReportsAction = Action<'mvj/leaseStatisticReport/FETCH_REPORTS', void>;
export type ReceiveReportsAction = Action<'mvj/leaseStatisticReport/RECEIVE_REPORTS', Reports>;
export type ReportsNotFoundAction = Action<'mvj/leaseStatisticReport/REPORTS_NOT_FOUND', void>;

export type FetchReportDataAction = Action<'mvj/leaseStatisticReport/FETCH_REPORT_DATA', Object>;
export type ReceiveReportDataAction = Action<'mvj/leaseStatisticReport/RECEIVE_REPORT_DATA', Object>;
export type ReportDataNotFoundAction = Action<'mvj/leaseStatisticReport/REPORT_DATA_NOT_FOUND', void>;

export type SetOptionsAction = Action<'mvj/leaseStatisticReport/SET_REPORT_OPTIONS', void>;

export type SetPayloadAction = Action<'mvj/leaseStatisticReport/SET_PAYLOAD', void>;

export type SendReportToMailAction = Action<'mvj/leaseStatisticReport/SEND_REPORT_TO_MAIL', void>;
export type NoMailSentAction = Action<'mvj/leaseStatisticReport/NO_MAIL_SENT', void>;
export type MailSentAction = Action<'mvj/leaseStatisticReport/MAIL_SENT', void>;

export type FetchOptionsAction = Action<'mvj/leaseStatisticReport/FETCH_OPTIONS', void>;
export type ReceiveOptionsAction = Action<'mvj/leaseStatisticReport/RECEIVE_OPTIONS', void>;
export type OptionsNotFoundAction = Action<'mvj/leaseStatisticReport/OPTIONS_NOT_FOUND', void>;
