import type { Action, Attributes, ApiResponse, Reports } from "../types";
export type LeaseStatisticReportState = {
  attributes: Attributes;
  isFetchingAttributes: boolean;
  leaseInvoicingConfirmationReportAttributes: Attributes;
  isFetchingLeaseInvoicingConfirmationReportAttributes: boolean;
  leaseInvoicingConfirmationReport: ApiResponse;
  isFetchingLeaseInvoicingConfirmationReport: boolean;
  reports: Reports;
  isFetchingReports: boolean;
  reportData: Record<string, any>;
  isFetchingReportData: boolean;
  reportOptions: Record<string, any>;
  isSendingMail: boolean;
  options: Record<string, any>;
  isFetchingOptions: boolean;
  payload: Record<string, any>;
};
export type LeaseInvoicingConfirmationReport = ApiResponse;
export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type AttributesNotFoundAction = Action<string, void>;
export type FetchLeaseInvoicingConfirmationReportAttributesAction = Action<string, void>;
export type ReceiveLeaseInvoicingConfirmationReportAttributesAction = Action<string, Attributes>;
export type LeaseInvoicingConfirmationReportAttributesNotFoundAction = Action<string, void>;
export type FetchLeaseInvoicingConfrimationReportsAction = Action<string, void>;
export type ReceiveLeaseInvoicingConfrimationReportsAction = Action<string, Record<string, any>>;
export type NotFoundLeaseInvoicingConfrimationReportsAction = Action<string, void>;
export type FetchReportsAction = Action<string, void>;
export type ReceiveReportsAction = Action<string, Reports>;
export type ReportsNotFoundAction = Action<string, void>;
export type FetchReportDataAction = Action<string, Record<string, any>>;
export type ReceiveReportDataAction = Action<string, Record<string, any>>;
export type ReportDataNotFoundAction = Action<string, void>;
export type SetOptionsAction = Action<string, void>;
export type SetPayloadAction = Action<string, void>;
export type SendReportToMailAction = Action<string, void>;
export type NoMailSentAction = Action<string, void>;
export type MailSentAction = Action<string, void>;
export type FetchOptionsAction = Action<string, void>;
export type ReceiveOptionsAction = Action<string, void>;
export type OptionsNotFoundAction = Action<string, void>;
export interface ReportOutputFieldInput {
  label: string;
  choices: Array<any>;
  format: string;
  is_numeric: boolean;
}
export interface ReportOutputField extends Omit<ReportOutputFieldInput, 'is_numeric'> {
  key: string;
  isNumeric: boolean;
}
export type ReportOptions = {
  output_fields: Record<string, ReportOutputFieldInput>;
  is_already_sorted: boolean;
}