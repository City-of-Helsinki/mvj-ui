// @flow
import type {Attributes, Selector} from '$src/types';
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
