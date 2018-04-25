// @flow

import type {Selector} from '../types';
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
