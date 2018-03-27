// @flow

import type {Selector} from '../types';
import get from 'lodash/get';
import type {Attributes, Comment, Lease, LeaseState} from './types';

export const getIsEditMode: Selector<boolean, void> = (state: LeaseState): boolean =>
  state.lease.isEditMode;

export const getIsFetching: Selector<Lease, void> = (state: Object): LeaseState =>
  state.lease.isFetching;

export const getIsDecisionsFormValid: Selector<any, void> = (state: Object): boolean =>
  state.lease.isDecisionsFormValid;

export const getIsLeaseAreasFormValid: Selector<any, void> = (state: Object): boolean =>
  state.lease.isLeaseAreasFormValid;

export const getIsLeaseInfoFormValid: Selector<any, void> = (state: Object): boolean =>
  state.lease.isLeaseInfoFormValid;

export const getIsSummaryFormValid: Selector<any, void> = (state: Object): boolean =>
  state.lease.isSummaryFormValid;

export const getAttributes: Selector<Attributes, void> = (state: Object): LeaseState =>
  state.lease.attributes;

export const getComments: Selector<Array<Comment>, void> = (state: Object): Array<Comment> =>
  state.lease.comments;

export const getCommentAttributes: Selector<Attributes, void> = (state: Object): Attributes =>
  state.lease.commentAttributes;

export const getLeasesList: Selector<Lease, void> = (state: Object): LeaseState =>
  state.lease.list;

export const getCurrentLease: Selector<Lease, void> = (state: Object): LeaseState =>
  state.lease.current;

export const getLessors: Selector<Object, void> = (state: Object): LeaseState =>
  state.lease.lessors;

export const getDecisions: Selector<Object, void> = (state: Object): LeaseState =>
  state.lease.decisions;

export const getAreasFormTouched: Selector<any, void> = (state: Object): Object =>
  get(state, 'form.lease-area-form.anyTouched');

export const getAreasFormValues: Selector<any, void> = (state: Object): Object =>
  get(state, 'form.lease-area-form.values');

export const getContractsFormTouched: Selector<any, void> = (state: Object): Object =>
  get(state, 'form.contracts-form.anyTouched');

export const getContractsFormValues: Selector<any, void> = (state: Object): Object =>
  get(state, 'form.contracts-form.values');

export const getDecisionsFormTouched: Selector<any, void> = (state: Object): Object =>
  get(state, 'form.decisions-form.anyTouched');

export const getDecisionsFormValues: Selector<any, void> = (state: Object): Object =>
  get(state, 'form.decisions-form.values');

export const getLeaseInfoFormTouched: Selector<any, void> = (state: Object): Object =>
  get(state, 'form.lease-info-form.anyTouched');

export const getLeaseInfoFormValues: Selector<any, void> = (state: Object): Object =>
  get(state, 'form.lease-info-form.values');

export const getSummaryFormTouched: Selector<any, void> = (state: Object): Object =>
  get(state, 'form.summary-form.anyTouched');

export const getSummaryFormValues: Selector<any, void> = (state: Object): Object =>
  get(state, 'form.summary-form.values');
