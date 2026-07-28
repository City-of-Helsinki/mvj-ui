import type { Attributes, Selector, Reports } from "types";
import type { RootState } from "@/root/types";
import type { ReportOptions } from "./types";
export const getIsFetchingAttributes: Selector<boolean, void> = (
  state: RootState,
): boolean => state.leaseReports.isFetchingAttributes;
export const getAttributes: Selector<Attributes, void> = (
  state: RootState,
): Attributes => state.leaseReports.attributes;
export const getIsFetchingLeaseInvoicingConfirmationReportAttributes: Selector<
  boolean,
  void
> = (state: RootState): boolean =>
  state.leaseReports.isFetchingLeaseInvoicingConfirmationReportAttributes;
export const getLeaseInvoicingConfirmationReportAttributes: Selector<
  Attributes,
  void
> = (state: RootState): Attributes =>
  state.leaseReports.leaseInvoicingConfirmationReportAttributes;
export const getIsFetchingLeaseInvoicingConfirmationReport: Selector<
  boolean,
  void
> = (state: RootState): boolean =>
  state.leaseReports.isFetchingLeaseInvoicingConfirmationReport;
export const getLeaseInvoicingConfirmationReport: Selector<Attributes, void> = (
  state: RootState,
): Attributes => state.leaseReports.leaseInvoicingConfirmationReport;
export const getIsFetchingReports: Selector<boolean, void> = (
  state: RootState,
): boolean => state.leaseReports.isFetchingReports;
export const getReports: Selector<Reports, void> = (
  state: RootState,
): Reports => state.leaseReports.reports;
export const getIsFetchingReportData: Selector<boolean, void> = (
  state: RootState,
): boolean => state.leaseReports.isFetchingReportData;
export const getReportData: Selector<Array<Record<string, any>>, void> = (
  state: RootState,
): Array<Record<string, any>> => state.leaseReports.reportData;
export const getReportOptions: Selector<ReportOptions, void> = (
  state: RootState,
): ReportOptions => state.leaseReports.reportOptions;
export const getIsSendingMail: Selector<boolean, void> = (
  state: RootState,
): boolean => state.leaseReports.isSendingMail;
export const getOptions: Selector<Record<string, any>, void> = (
  state: RootState,
): Record<string, any> => state.leaseReports.options;
export const getIsFetchingOptions: Selector<boolean, void> = (
  state: RootState,
): boolean => state.leaseReports.isFetchingOptions;
export const getPayload: Selector<Record<string, any>, void> = (
  state: RootState,
): Record<string, any> => state.leaseReports.payload;
