import { createAction } from "redux-actions";
import type { Attributes, Reports } from "types";
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
  createAction("mvj/leaseStatisticReport/FETCH_ATTRIBUTES")();
export const receiveAttributes = (
  attributes: Attributes,
): ReceiveAttributesAction =>
  createAction("mvj/leaseStatisticReport/RECEIVE_ATTRIBUTES")(attributes);
export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction("mvj/leaseStatisticReport/ATTRIBUTES_NOT_FOUND")();
export const fetchLeaseInvoicingConfirmationReportAttributes =
  (): FetchLeaseInvoicingConfirmationReportAttributesAction =>
    createAction(
      "mvj/leaseStatisticReport/FETCH_LEASE_INVOICING_CONFIRMATION_REPORT_ATTRIBUTES",
    )();
export const receiveLeaseInvoicingConfirmationReportAttributes = (
  attributes: Attributes,
): ReceiveLeaseInvoicingConfirmationReportAttributesAction =>
  createAction(
    "mvj/leaseStatisticReport/RECEIVE_LEASE_INVOICING_CONFIRMATION_REPORT_ATTRIBUTES",
  )(attributes);
export const leaseInvoicingConfirmationReportAttributesNotFound =
  (): LeaseInvoicingConfirmationReportAttributesNotFoundAction =>
    createAction(
      "mvj/leaseStatisticReport/LEASE_INVOICING_CONFIRMATION_REPORT_ATTRIBUTES_ATTRIBUTES_NOT_FOUND",
    )();
export const fetchLeaseInvoicingConfrimationReports = (
  query: Record<string, any>,
): FetchLeaseInvoicingConfrimationReportsAction =>
  createAction(
    "mvj/leaseStatisticReport/FETCH_LEASE_INVOICING_CONFIRMATION_REPORTS",
  )(query);
export const receiveLeaseInvoicingConfrimationReports = (
  runs: Record<string, any>,
): ReceiveLeaseInvoicingConfrimationReportsAction =>
  createAction(
    "mvj/leaseStatisticReport/RECEIVE_LEASE_INVOICING_CONFIRMATION_REPORTS",
  )(runs);
export const notFoundLeaseInvoicingConfrimationReports =
  (): NotFoundLeaseInvoicingConfrimationReportsAction =>
    createAction(
      "mvj/leaseStatisticReport/NOT_FOUND_LEASE_INVOICING_CONFIRMATION_REPORTS",
    )();
export const fetchReports = (): FetchReportsAction =>
  createAction("mvj/leaseStatisticReport/FETCH_REPORTS")();
export const receiveReports = (reports: Reports): ReceiveReportsAction =>
  createAction("mvj/leaseStatisticReport/RECEIVE_REPORTS")(reports);
export const reportsNotFound = (): ReportsNotFoundAction =>
  createAction("mvj/leaseStatisticReport/REPORTS_NOT_FOUND")();
export const fetchReportData = (
  payload: Record<string, any>,
): FetchReportDataAction =>
  createAction("mvj/leaseStatisticReport/FETCH_REPORT_DATA")(payload);
export const receiveReportData = (
  reportData: Record<string, any>,
): ReceiveReportDataAction =>
  createAction("mvj/leaseStatisticReport/RECEIVE_REPORT_DATA")(reportData);
export const reportDataNotFound = (): ReportDataNotFoundAction =>
  createAction("mvj/leaseStatisticReport/REPORT_DATA_NOT_FOUND")();
export const setOptions = (options: Record<string, any>): SetOptionsAction =>
  createAction("mvj/leaseStatisticReport/SET_REPORT_OPTIONS")(options);
export const setPayload = (payload: Record<string, any>): SetPayloadAction =>
  createAction("mvj/leaseStatisticReport/SET_PAYLOAD")(payload);
export const sendReportToMail = (
  payload: Record<string, any>,
): SendReportToMailAction =>
  createAction("mvj/leaseStatisticReport/SEND_REPORT_TO_MAIL")(payload);
export const noMailSent = (): NoMailSentAction =>
  createAction("mvj/leaseStatisticReport/NO_MAIL_SENT")();
export const mailSent = (payload?: Record<string, any>): MailSentAction =>
  createAction("mvj/leaseStatisticReport/MAIL_SENT")(payload);
export const fetchOptions = (
  payload: Record<string, any>,
): FetchOptionsAction =>
  createAction("mvj/leaseStatisticReport/FETCH_OPTIONS")(payload);
export const receiveOptions = (
  payload: Record<string, any>,
): ReceiveOptionsAction =>
  createAction("mvj/leaseStatisticReport/RECEIVE_OPTIONS")(payload);
export const optionsNotFound = (): OptionsNotFoundAction =>
  createAction("mvj/leaseStatisticReport/OPTIONS_NOT_FOUND")();
