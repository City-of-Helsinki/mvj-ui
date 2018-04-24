// @flow

import type {Selector} from '../types';
import get from 'lodash/get';
import type {
  Attributes,
  ContactModalSettings,
  DecisionList,
  DistrictList,
  Lease,
  LeaseList,
  LeaseState,
  LessorList,
} from './types';

export const getIsContactModalOpen: Selector<boolean, void> = (state: LeaseState): boolean =>
  state.lease.isContactModalOpen;

export const getContactModalSettings: Selector<ContactModalSettings, void> = (state: LeaseState): ContactModalSettings =>
  state.lease.contactModalSettings;

export const getIsEditMode: Selector<boolean, void> = (state: LeaseState): boolean =>
  state.lease.isEditMode;

export const getIsFetching: Selector<boolean, void> = (state: LeaseState): boolean =>
  state.lease.isFetching;

export const getIsConstructabilityFormValid: Selector<boolean, void> = (state: LeaseState): boolean =>
  state.lease.isConstructabilityFormValid;

export const getIsContractsFormValid: Selector<boolean, void> = (state: LeaseState): boolean =>
  state.lease.isContractsFormValid;

export const getIsDecisionsFormValid: Selector<boolean, void> = (state: LeaseState): boolean =>
  state.lease.isDecisionsFormValid;

export const getIsInspectionsFormValid: Selector<boolean, void> = (state: LeaseState): boolean =>
  state.lease.isInspectionsFormValid;

export const getIsLeaseAreasFormValid: Selector<boolean, void> = (state: LeaseState): boolean =>
  state.lease.isLeaseAreasFormValid;

export const getIsLeaseInfoFormValid: Selector<boolean, void> = (state: LeaseState): boolean =>
  state.lease.isLeaseInfoFormValid;

export const getIsRentsFormValid: Selector<boolean, void> = (state: LeaseState): boolean =>
  state.lease.isRentsFormValid;

export const getIsSummaryFormValid: Selector<boolean, void> = (state: LeaseState): boolean =>
  state.lease.isSummaryFormValid;

export const getIsTenantsFormValid: Selector<boolean, void> = (state: LeaseState): boolean =>
  state.lease.isTenantsFormValid;

export const getAttributes: Selector<Attributes, void> = (state: LeaseState): LeaseState =>
  state.lease.attributes;

export const getLeasesList: Selector<LeaseList, void> = (state: LeaseState): LeaseList =>
  state.lease.list;

export const getCurrentLease: Selector<Lease, void> = (state: LeaseState): Lease =>
  state.lease.current;

export const getDecisions: Selector<DecisionList, void> = (state: LeaseState): DecisionList =>
  state.lease.decisions;

export const getDistricts: Selector<DistrictList, void> = (state: LeaseState): DistrictList =>
  state.lease.districts;

export const getLessors: Selector<LessorList, void> = (state: LeaseState): LessorList =>
  state.lease.lessors;

export const getAreasFormTouched: Selector<boolean, void> = (state: Object): boolean =>
  get(state, 'form.lease-areas-form.anyTouched');

export const getAreasFormValues: Selector<Object, void> = (state: Object): Object =>
  get(state, 'form.lease-areas-form.values');

export const getContractsFormTouched: Selector<boolean, void> = (state: Object): boolean =>
  get(state, 'form.contracts-form.anyTouched');

export const getContractsFormValues: Selector<Object, void> = (state: Object): Object =>
  get(state, 'form.contracts-form.values');

export const getConstructabilityFormTouched: Selector<boolean, void> = (state: Object): boolean =>
  get(state, 'form.constructability-form.anyTouched');

export const getDecisionsFormTouched: Selector<boolean, void> = (state: Object): boolean =>
  get(state, 'form.decisions-form.anyTouched');

export const getInspectionsFormTouched: Selector<boolean, void> = (state: Object): boolean =>
  get(state, 'form.inspections-form.anyTouched');

export const getLeaseInfoFormTouched: Selector<boolean, void> = (state: Object): boolean =>
  get(state, 'form.lease-info-form.anyTouched');

export const getLeaseInfoFormValues: Selector<Object, void> = (state: Object): Object =>
  get(state, 'form.lease-info-form.values');

export const getRentsFormTouched: Selector<boolean, void> = (state: Object): boolean =>
  get(state, 'form.rents-form.anyTouched');

export const getRentsFormValues: Selector<any, void> = (state: Object): Object =>
  get(state, 'form.rents-form.values');

export const getSummaryFormTouched: Selector<boolean, void> = (state: Object): boolean =>
  get(state, 'form.summary-form.anyTouched');

export const getTenantsFormTouched: Selector<boolean, void> = (state: Object): boolean =>
  get(state, 'form.tenants-form.anyTouched');

export const getEditInvoiceFormErrors: Selector<Object, void> = (state: Object): Object =>
  get(state, 'form.edit-invoice-form.syncErrors');

export const getEditInvoiceFormValues: Selector<Object, void> = (state: Object): Object =>
  get(state, 'form.edit-invoice-form.values');

export const getNewInvoiceFormErrors: Selector<Object, void> = (state: Object): Object =>
  get(state, 'form.new-invoice-form.syncErrors');

export const getNewInvoiceFormValues: Selector<Object, void> = (state: Object): Object =>
  get(state, 'form.new-invoice-form.values');
