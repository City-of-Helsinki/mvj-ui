// @flow
import get from 'lodash/get';

import {summaryFinancialMethodOptions,
  summaryHitasOptions,
  summaryLeaseUseOptions,
  summaryLessorOptions,
  summaryManagementMethodOptions,
  summaryNoticePeriodOptions,
  summaryTransferRightOptions} from './constants';

export const getSummaryFinancialMethodLabel = (value: string) => {
  const option = summaryFinancialMethodOptions.find(x => x.value=== value);
  return get(option, 'label', '');
};

export const getSummaryHitasLabel = (value: string) => {
  const option = summaryHitasOptions.find(x => x.value=== value);
  return get(option, 'label', '');
};

export const getSummaryLeaseUseLabel = (value: string) => {
  const option = summaryLeaseUseOptions.find(x => x.value=== value);
  return get(option, 'label', '');
};

export const getSummaryLessorLabel = (value: string) => {
  const option = summaryLessorOptions.find(x => x.value=== value);
  return get(option, 'label', '');
};

export const getSummaryManagementMethodLabel = (value: string) => {
  const option = summaryManagementMethodOptions.find(x => x.value=== value);
  return get(option, 'label', '');
};

export const getSummaryNoticePeriodLabel = (value: string) => {
  const option = summaryNoticePeriodOptions.find(x => x.value=== value);
  return get(option, 'label', '');
};

export const getSummaryTransferRightLabel = (value: string) => {
  const option = summaryTransferRightOptions.find(x => x.value=== value);
  return get(option, 'label', '');
};
