import { createAction } from "redux-actions";
import type { Attributes, Reports } from "types";
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  AttributesNotFoundAction,
  FetchLeaseReportsResultsAttributesAction,
  ReceiveLeaseReportsResultsAttributesAction,
  LeaseReportsResultsAttributesNotFoundAction,
  FetchLeaseInvoicingConfrimationReportsAction,
  NotFoundLeaseInvoicingConfrimationReportsAction,
  ReceiveLeaseInvoicingConfrimationReportsAction,
  FetchReportsAction,
  ReceiveReportsAction,
  ReportsNotFoundAction,
  FetchReportDataAction,
  ReceiveReportDataAction,
  ReportDataNotFoundAction,
  SetOptionsAction,
  SendReportToMailAction,
  NoMailSentAction,
  MailSentAction,
  FetchOptionsAction,
  ReceiveOptionsAction,
  OptionsNotFoundAction,
  SetPayloadAction,
} from "./types";
export const fetchAttributes = (): FetchAttributesAction =>
  createAction("mvj/reports/FETCH_ATTRIBUTES")();
export const receiveAttributes = (
  attributes: Attributes,
): ReceiveAttributesAction =>
  createAction("mvj/reports/RECEIVE_ATTRIBUTES")(attributes);
export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction("mvj/reports/ATTRIBUTES_NOT_FOUND")();
export const fetchLeaseReportsResultsAttributes =
  (): FetchLeaseReportsResultsAttributesAction =>
    createAction("mvj/reports/FETCH_LEASE_REPORTS_RESULTS_ATTRIBUTES")();
export const receiveLeaseReportsResultsAttributes = (
  attributes: Attributes,
): ReceiveLeaseReportsResultsAttributesAction =>
  createAction("mvj/reports/RECEIVE_LEASE_REPORTS_RESULTS_ATTRIBUTES")(
    attributes,
  );
export const leaseReportsResultsAttributesNotFound =
  (): LeaseReportsResultsAttributesNotFoundAction =>
    createAction(
      "mvj/reports/LEASE_REPORTS_RESULTS_ATTRIBUTES_ATTRIBUTES_NOT_FOUND",
    )();
export const fetchLeaseInvoicingConfrimationReports = (
  query: Record<string, any>,
): FetchLeaseInvoicingConfrimationReportsAction =>
  createAction("mvj/reports/FETCH_LEASE_REPORTS_RESULTSS")(query);
export const receiveLeaseInvoicingConfrimationReports = (
  runs: Record<string, any>,
): ReceiveLeaseInvoicingConfrimationReportsAction =>
  createAction("mvj/reports/RECEIVE_LEASE_REPORTS_RESULTSS")(runs);
export const notFoundLeaseInvoicingConfrimationReports =
  (): NotFoundLeaseInvoicingConfrimationReportsAction =>
    createAction("mvj/reports/NOT_FOUND_LEASE_REPORTS_RESULTSS")();
export const fetchReports = (): FetchReportsAction =>
  createAction("mvj/reports/FETCH_REPORTS")();
export const receiveReports = (reports: Reports): ReceiveReportsAction =>
  createAction("mvj/reports/RECEIVE_REPORTS")(reports);
export const reportsNotFound = (): ReportsNotFoundAction =>
  createAction("mvj/reports/REPORTS_NOT_FOUND")();
export const fetchReportData = (
  payload: Record<string, any>,
): FetchReportDataAction =>
  createAction("mvj/reports/FETCH_REPORT_DATA")(payload);
export const receiveReportData = (
  reportData: Record<string, any>,
): ReceiveReportDataAction =>
  createAction("mvj/reports/RECEIVE_REPORT_DATA")(reportData);
export const reportDataNotFound = (): ReportDataNotFoundAction =>
  createAction("mvj/reports/REPORT_DATA_NOT_FOUND")();
export const setOptions = (options: Record<string, any>): SetOptionsAction =>
  createAction("mvj/reports/SET_REPORT_OPTIONS")(options);
export const setPayload = (payload: Record<string, any>): SetPayloadAction =>
  createAction("mvj/reports/SET_PAYLOAD")(payload);
export const sendReportToMail = (
  payload: Record<string, any>,
): SendReportToMailAction =>
  createAction("mvj/reports/SEND_REPORT_TO_MAIL")(payload);
export const noMailSent = (): NoMailSentAction =>
  createAction("mvj/reports/NO_MAIL_SENT")();
export const mailSent = (payload?: Record<string, any>): MailSentAction =>
  createAction("mvj/reports/MAIL_SENT")(payload);
export const fetchOptions = (payload: string): FetchOptionsAction =>
  createAction("mvj/reports/FETCH_OPTIONS")(payload);
export const receiveOptions = (
  payload: Record<string, any>,
): ReceiveOptionsAction => createAction("mvj/reports/RECEIVE_OPTIONS")(payload);
export const optionsNotFound = (): OptionsNotFoundAction =>
  createAction("mvj/reports/OPTIONS_NOT_FOUND")();
