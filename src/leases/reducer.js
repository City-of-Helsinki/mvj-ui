// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  Attributes,
  Lease,
  LeaseList,
  ReceiveAttributesAction,
  ReceiveLeasesAction,
  ReceiveSingleLeaseAction,
  ContactModalSettings,
  ReceiveContactModalSettingsAction,
  ReceiveConstructabilityFormValidAction,
  ReceiveContractsFormValidAction,
  ReceiveDecisionsFormValidAction,
  ReceiveInspectionsFormValidAction,
  ReceiveLeaseAreasFormValidAction,
  ReceiveLeaseInfoFormValidAction,
  ReceiveRentsFormValidAction,
  ReceiveSummaryFormValidAction,
  ReceiveTenantsFormValidAction,
} from './types';

const isEditModeReducer: Reducer<boolean> = handleActions({
  'mvj/leases/HIDE_EDIT': () => false,
  'mvj/leases/SHOW_EDIT': () => true,
}, false);

const isContactModalOpenReducer: Reducer<boolean> = handleActions({
  'mvj/leases/HIDE_CONTACT_MODAL': () => false,
  'mvj/leases/SHOW_CONTACT_MODAL': () => true,
}, false);

const contactModalSettingsReducer: Reducer<ContactModalSettings> = handleActions({
  ['mvj/leases/RECEIVE_CONTACT_SETTINGS']: (state: ContactModalSettings, {payload: settings}: ReceiveContactModalSettingsAction) => {
    return settings;
  },
}, null);

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/leases/CREATE': () => true,
  'mvj/leases/EDIT': () => true,
  'mvj/leases/PATCH': () => true,
  'mvj/leases/FETCH_ALL': () => true,
  'mvj/leases/FETCH_SINGLE': () => true,
  'mvj/leases/NOT_FOUND': () => false,
  'mvj/leases/RECEIVE_ALL': () => false,
  'mvj/leases/RECEIVE_SINGLE': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/leases/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, {});

const leasesListReducer: Reducer<LeaseList> = handleActions({
  ['mvj/leases/RECEIVE_ALL']: (state: LeaseList, {payload: leases}: ReceiveLeasesAction) => {
    return leases;
  },
}, {});

const currentLeaseReducer: Reducer<Lease> = handleActions({
  ['mvj/leases/RECEIVE_SINGLE']: (state: Lease, {payload: lease}: ReceiveSingleLeaseAction) => {
    return lease;
  },
}, {});

const constructabilityFormValidReducer: Reducer<boolean> = handleActions({
  ['mvj/leases/RECEIVE_CONSTRUCTABILITY_FORM_VALID']: (state: boolean, {payload: valid}: ReceiveConstructabilityFormValidAction) => {
    return valid;
  },
  'mvj/leases/CLEAR_FORM_VALIDITY_FLAGS': () => true,
}, true);

const contractsFormValidReducer: Reducer<boolean> = handleActions({
  ['mvj/leases/RECEIVE_CONTRACTS_FORM_VALID']: (state: boolean, {payload: valid}: ReceiveContractsFormValidAction) => {
    return valid;
  },
  'mvj/leases/CLEAR_FORM_VALIDITY_FLAGS': () => true,
}, true);

const decisionsFormValidReducer: Reducer<boolean> = handleActions({
  ['mvj/leases/RECEIVE_DECISIONS_FORM_VALID']: (state: boolean, {payload: valid}: ReceiveDecisionsFormValidAction) => {
    return valid;
  },
  'mvj/leases/CLEAR_FORM_VALIDITY_FLAGS': () => true,
}, true);

const inspectionsFormValidReducer: Reducer<boolean> = handleActions({
  ['mvj/leases/RECEIVE_INSPECTIONS_FORM_VALID']: (state: boolean, {payload: valid}: ReceiveInspectionsFormValidAction) => {
    return valid;
  },
  'mvj/leases/CLEAR_FORM_VALIDITY_FLAGS': () => true,
}, true);

const leaseAreasFormValidReducer: Reducer<boolean> = handleActions({
  ['mvj/leases/RECEIVE_LEASE_AREAS_FORM_VALID']: (state: boolean, {payload: valid}: ReceiveLeaseAreasFormValidAction) => {
    return valid;
  },
  'mvj/leases/CLEAR_FORM_VALIDITY_FLAGS': () => true,
}, true);

const leaseInfoFormValidReducer: Reducer<boolean> = handleActions({
  ['mvj/leases/RECEIVE_LEASE_INFO_FORM_VALID']: (state: boolean, {payload: valid}: ReceiveLeaseInfoFormValidAction) => {
    return valid;
  },
  'mvj/leases/CLEAR_FORM_VALIDITY_FLAGS': () => true,
}, true);

const rentsFormValidReducer: Reducer<boolean> = handleActions({
  ['mvj/leases/RECEIVE_RENTS_FORM_VALID']: (state: boolean, {payload: valid}: ReceiveRentsFormValidAction) => {
    return valid;
  },
  'mvj/leases/CLEAR_FORM_VALIDITY_FLAGS': () => true,
}, true);

const summaryFormValidReducer: Reducer<boolean> = handleActions({
  ['mvj/leases/RECEIVE_SUMMARY_FORM_VALID']: (state: boolean, {payload: valid}: ReceiveSummaryFormValidAction) => {
    return valid;
  },
  'mvj/leases/CLEAR_FORM_VALIDITY_FLAGS': () => true,
}, true);

const tenantsFormValidReducer: Reducer<boolean> = handleActions({
  ['mvj/leases/RECEIVE_TENANTS_FORM_VALID']: (state: boolean, {payload: valid}: ReceiveTenantsFormValidAction) => {
    return valid;
  },
  'mvj/leases/CLEAR_FORM_VALIDITY_FLAGS': () => true,
}, true);

export default combineReducers({
  attributes: attributesReducer,
  contactModalSettings: contactModalSettingsReducer,
  current: currentLeaseReducer,
  isContactModalOpen: isContactModalOpenReducer,
  isEditMode: isEditModeReducer,
  isFetching: isFetchingReducer,
  isConstructabilityFormValid: constructabilityFormValidReducer,
  isContractsFormValid: contractsFormValidReducer,
  isDecisionsFormValid: decisionsFormValidReducer,
  isInspectionsFormValid: inspectionsFormValidReducer,
  isLeaseAreasFormValid: leaseAreasFormValidReducer,
  isLeaseInfoFormValid: leaseInfoFormValidReducer,
  isRentsFormValid: rentsFormValidReducer,
  isSummaryFormValid: summaryFormValidReducer,
  isTenantsFormValid: tenantsFormValidReducer,
  list: leasesListReducer,
});
