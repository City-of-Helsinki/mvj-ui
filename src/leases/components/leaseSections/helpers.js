// @flow
import get from 'lodash/get';

import {rentBasicInfoIndexTypeOptions,
  rentBasicInfoRentalPeriodOptions,
  rentBasicInfoTypeOptions,
  rentContractRentPurposeOptions,
  rentContractRentTypeOptions,
  rentDiscountDecisionOptions,
  rentDiscountPurposeOptions,
  rentDiscountTypeOptions,
  summaryFinancialMethodOptions,
  summaryHitasOptions,
  summaryLeaseStatisticalUseOptions,
  summaryLeaseUseOptions,
  summaryLessorOptions,
  summaryManagementMethodOptions,
  summaryNoticePeriodOptions,
  summaryPublicityOptions,
  summaryRegulatoryOptions,
  summaryRegulatoryMethodOptions,
  summarySpecialApartmentsOptions,
  summaryTransferRightOptions} from './constants';

export const getBasicInfoIndexTypeLabel = (value: string) => {
  const option = rentBasicInfoIndexTypeOptions.find(x => x.value=== value);
  return get(option, 'label', '');
};

export const getBasicInfoRentalPeriodLabel = (value: string) => {
  const option = rentBasicInfoRentalPeriodOptions.find(x => x.value=== value);
  return get(option, 'label', '');
};

export const getBasicInfoTypeLabel = (value: string) => {
  const option = rentBasicInfoTypeOptions.find(x => x.value=== value);
  return get(option, 'label', '');
};

export const getRentContractRentPurposeLabel = (value: string) => {
  const option = rentContractRentPurposeOptions.find(x => x.value=== value);
  return get(option, 'label', '');
};

export const getRentContractRentTypeLabel = (value: string) => {
  const option = rentContractRentTypeOptions.find(x => x.value=== value);
  return get(option, 'label', '');
};

export const getRentDiscountDecisionLabel = (value: string) => {
  const option = rentDiscountDecisionOptions.find(x => x.value=== value);
  return get(option, 'label', '');
};

export const getRentDiscountPurposeLabel = (value: string) => {
  const option = rentDiscountPurposeOptions.find(x => x.value=== value);
  return get(option, 'label', '');
};

export const getRentDiscountTypeLabel = (value: string) => {
  const option = rentDiscountTypeOptions.find(x => x.value=== value);
  return get(option, 'label', '');
};

export const getSummaryFinancialMethodLabel = (value: string) => {
  const option = summaryFinancialMethodOptions.find(x => x.value=== value);
  return get(option, 'label', '');
};

export const getSummaryHitasLabel = (value: string) => {
  const option = summaryHitasOptions.find(x => x.value=== value);
  return get(option, 'label', '');
};

export const getSummaryLeaseStatisticalUseLabel = (value: string) => {
  const option = summaryLeaseStatisticalUseOptions.find(x => x.value=== value);
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

export const getSummaryPublicityLabel = (value: string) => {
  const option = summaryPublicityOptions.find(x => x.value === value);
  return get(option, 'label', '');
};

export const getSummaryRegulatoryLabel = (value: string) => {
  const option = summaryRegulatoryOptions.find(x => x.value=== value);
  return get(option, 'label', '');
};

export const getSummaryRegulatoryMethodLabel = (value: string) => {
  const option = summaryRegulatoryMethodOptions.find(x => x.value=== value);
  return get(option, 'label', '');
};

export const getSummarySpecialApartmentsLabel = (value: string) => {
  const option = summarySpecialApartmentsOptions.find(x => x.value=== value);
  return get(option, 'label', '');
};

export const getSummaryTransferRightLabel = (value: string) => {
  const option = summaryTransferRightOptions.find(x => x.value=== value);
  return get(option, 'label', '');
};
