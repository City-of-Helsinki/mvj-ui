// @flow
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import type {Selector} from '../types';
import type {
  Attributes,
  ContactModalSettings,
  LeaseId,
  Lease,
  LeaseList,
  LeaseState,
} from './types';

export const getIsContactModalOpen: Selector<boolean, void> = (state: LeaseState): boolean =>
  state.lease.isContactModalOpen;

export const getContactModalSettings: Selector<ContactModalSettings, void> = (state: LeaseState): ContactModalSettings =>
  state.lease.contactModalSettings;

export const getIsDeleteRelatedLeaseModalOpen: Selector<boolean, void> = (state: LeaseState): boolean =>
  state.lease.isDeleteRelatedLeaseModalOpen;

export const getIsEditMode: Selector<boolean, void> = (state: LeaseState): boolean =>
  state.lease.isEditMode;

export const getIsFetching: Selector<boolean, void> = (state: LeaseState): boolean =>
  state.lease.isFetching;

export const getIsFetchingById: Selector<boolean, LeaseId> = (state: LeaseState, id: LeaseId): boolean =>
  state.lease.isFetchingById[id];

export const getIsFetchingAttributes: Selector<boolean, void> = (state: LeaseState): boolean =>
  state.lease.isFetchingAttributes;

export const getIsFormValidById: Selector<boolean, string> = (state: LeaseState, id: string): boolean =>
  state.lease.isFormValidById[id];

export const getIsFormValidFlags: Selector<Object, void> = (state: LeaseState): Object =>
  state.lease.isFormValidById;

export const getIsSaveClicked: Selector<boolean, void> = (state: LeaseState): boolean =>
  state.lease.isSaveClicked;

export const getAttributes: Selector<Attributes, void> = (state: LeaseState): LeaseState =>
  state.lease.attributes;

export const getLeasesList: Selector<LeaseList, void> = (state: LeaseState): LeaseList =>
  state.lease.list;

export const getCurrentLease: Selector<Lease, void> = (state: LeaseState): Lease =>
  state.lease.current;

export const getLeaseById: Selector<Lease, LeaseId> = (state: LeaseState, id: LeaseId): Lease =>
  state.lease.byId[id];

export const getErrorsByFormName: Selector<?Object, string> = (state: Object, formName: string): ?Object => {
  const form = state.form[formName];
  if(!isEmpty(form)) {
    return form.syncErrors;
  }
  return null;
};

export const getCollapseStateByKey: Selector<?Object, string> = (state: Object, key: string): ?Object => {
  return get(state.lease.collapseStates, key);
};
