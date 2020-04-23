// @flow
import type {Attributes, Selector, Reports} from '$src/types';
import type {RootState} from '$src/root/types';

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.leaseStatisticReport.isFetchingAttributes;
  
export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.leaseStatisticReport.attributes;
  
export const getIsFetchingLeaseInvoicingConfirmationReportAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.leaseStatisticReport.isFetchingLeaseInvoicingConfirmationReportAttributes;

export const getLeaseInvoicingConfirmationReportAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.leaseStatisticReport.leaseInvoicingConfirmationReportAttributes;

export const getIsFetchingLeaseInvoicingConfirmationReport: Selector<boolean, void> = (state: RootState): boolean =>
  state.leaseStatisticReport.isFetchingLeaseInvoicingConfirmationReport;

export const getLeaseInvoicingConfirmationReport: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.leaseStatisticReport.leaseInvoicingConfirmationReport;

export const getIsFetchingReports: Selector<boolean, void> = (state: RootState): boolean =>
  state.leaseStatisticReport.isFetchingReports;
  
export const getReports: Selector<Attributes, void> = (state: RootState): Reports =>
  state.leaseStatisticReport.reports;

export const getIsFetchingReportData: Selector<boolean, void> = (state: RootState): boolean =>
  state.leaseStatisticReport.isFetchingReportData;
  
export const getReportData: Selector<Object, void> = (state: RootState): Object =>
  state.leaseStatisticReport.reportData;

export const getReportType: Selector<string, void> = (state: RootState): string =>
  state.leaseStatisticReport.reportType;

export const getIsSendingMail: Selector<boolean, void> = (state: RootState): boolean =>
  state.leaseStatisticReport.isSendingMail;
