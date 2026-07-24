import type { Attributes, Selector, Reports } from "types";
import type { RootState } from "@/root/types";
import type { ReportOptions } from "./types";
export const getIsFetchingAttributes: Selector<boolean, void> = (
  state: RootState,
): boolean => state.leaseStatisticReport.isFetchingAttributes;
export const getAttributes: Selector<Attributes, void> = (
  state: RootState,
): Attributes => state.leaseStatisticReport.attributes;
export const getIsFetchingLeaseInvoicingConfirmationReportAttributes: Selector<
  boolean,
  void
> = (state: RootState): boolean =>
  state.leaseStatisticReport
    .isFetchingLeaseInvoicingConfirmationReportAttributes;
export const getLeaseInvoicingConfirmationReportAttributes: Selector<
  Attributes,
  void
> = (state: RootState): Attributes =>
  state.leaseStatisticReport.leaseInvoicingConfirmationReportAttributes;
export const getIsFetchingLeaseInvoicingConfirmationReport: Selector<
  boolean,
  void
> = (state: RootState): boolean =>
  state.leaseStatisticReport.isFetchingLeaseInvoicingConfirmationReport;
export const getLeaseInvoicingConfirmationReport: Selector<Attributes, void> = (
  state: RootState,
): Attributes => state.leaseStatisticReport.leaseInvoicingConfirmationReport;
export const getIsFetchingReports: Selector<boolean, void> = (
  state: RootState,
): boolean => state.leaseStatisticReport.isFetchingReports;
export const getReports: Selector<Reports, void> = (
  state: RootState,
): Reports => state.leaseStatisticReport.reports;
export const getIsFetchingReportData: Selector<boolean, void> = (
  state: RootState,
): boolean => state.leaseStatisticReport.isFetchingReportData;
export const getReportData: Selector<Array<Record<string, any>>, void> = (
  state: RootState,
): Array<Record<string, any>> => state.leaseStatisticReport.reportData;
export const getReportOptions: Selector<ReportOptions, void> = (
  state: RootState,
): ReportOptions => state.leaseStatisticReport.reportOptions;
export const getIsSendingMail: Selector<boolean, void> = (
  state: RootState,
): boolean => state.leaseStatisticReport.isSendingMail;
export const getOptions: Selector<Record<string, any>, void> = (
  state: RootState,
): Record<string, any> => state.leaseStatisticReport.options;
export const getIsFetchingOptions: Selector<boolean, void> = (
  state: RootState,
): boolean => state.leaseStatisticReport.isFetchingOptions;
export const getPayload: Selector<Record<string, any>, void> = (
  state: RootState,
): Record<string, any> => state.leaseStatisticReport.payload;
