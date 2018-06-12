// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '$src/types';
import {FormNames} from '$src/leases/enums';
import type {
  Attributes,
  Lease,
  LeaseList,
  ReceiveAttributesAction,
  ReceiveLeasesAction,
  ReceiveSingleLeaseAction,
  FetchLeaseByIdAction,
  ReceiveLeaseByIdAction,
  LeaseNotFoundByIdAction,
  ContactModalSettings,
  ReceiveContactModalSettingsAction,
  ReceiveFormValidFlagsAction,
  ReceiveIsSaveClickedAction,
} from '$src/leases/types';


const isEditModeReducer: Reducer<boolean> = handleActions({
  'mvj/leases/HIDE_EDIT': () => false,
  'mvj/leases/SHOW_EDIT': () => true,
}, false);

const isContactModalOpenReducer: Reducer<boolean> = handleActions({
  'mvj/leases/HIDE_CONTACT_MODAL': () => false,
  'mvj/leases/SHOW_CONTACT_MODAL': () => true,
}, false);

const isDeleteRelatedLeaseModalOpenReducer: Reducer<boolean> = handleActions({
  'mvj/leases/HIDE_RELATED_LEASE_MODAL': () => false,
  'mvj/leases/SHOW_RELATED_LEASE_MODAL': () => true,
}, false);

const contactModalSettingsReducer: Reducer<ContactModalSettings> = handleActions({
  ['mvj/leases/RECEIVE_CONTACT_SETTINGS']: (state: ContactModalSettings, {payload: settings}: ReceiveContactModalSettingsAction) => {
    return settings;
  },
}, null);

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/leases/CREATE': () => true,
  'mvj/leases/PATCH': () => true,
  'mvj/leases/FETCH_ALL': () => true,
  'mvj/leases/FETCH_SINGLE': () => true,
  'mvj/leases/NOT_FOUND': () => false,
  'mvj/leases/RECEIVE_ALL': () => false,
  'mvj/leases/RECEIVE_SINGLE': () => false,
}, false);

const isFetchingByIdReducer: Reducer<Object> = handleActions({
  ['mvj/leases/FETCH_BY_ID']: (state: Object, {payload: id}: FetchLeaseByIdAction) => {
    return {
      ...state,
      [id]: true,
    };
  },
  ['mvj/leases/RECEIVE_BY_ID']: (state: Object, {payload}: ReceiveLeaseByIdAction) => {
    return {
      ...state,
      [payload.leaseId]: false,
    };
  },
  ['mvj/leases/NOT_FOUND_BY_ID']: (state: Object, {payload: id}: LeaseNotFoundByIdAction) => {
    return {
      ...state,
      [id]: false,
    };
  },
}, {});

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/leases/FETCH_ATTRIBUTES': () => true,
  'mvj/leases/RECEIVE_ATTRIBUTES': () => false,
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

const byIdReducer: Reducer<Lease> = handleActions({
  ['mvj/leases/RECEIVE_BY_ID']: (state: Lease, {payload}: ReceiveLeaseByIdAction) => {
    return {
      ...state,
      [payload.leaseId]: payload.lease,
    };
  },
}, {});

const isFormValidByIdReducer: Reducer<Object> = handleActions({
  ['mvj/leases/RECEIVE_FORM_VALID_FLAGS']: (state: Object, {payload: valid}: ReceiveFormValidFlagsAction) => {
    return {
      ...state,
      ...valid,
    };
  },
  ['mvj/leases/CLEAR_FORM_VALID_FLAGS']: () => {
    return {
      [FormNames.CONSTRUCTABILITY]: true,
      [FormNames.CONTRACTS]: true,
      [FormNames.DECISIONS]: true,
      [FormNames.INSPECTIONS]: true,
      [FormNames.LEASE_AREAS]: true,
      [FormNames.LEASE_INFO]: true,
      [FormNames.RENTS]: true,
      [FormNames.SUMMARY]: true,
      [FormNames.TENANTS]: true,
    };
  },
}, {
  [FormNames.CONSTRUCTABILITY]: true,
  [FormNames.CONTRACTS]: true,
  [FormNames.DECISIONS]: true,
  [FormNames.INSPECTIONS]: true,
  [FormNames.LEASE_AREAS]: true,
  [FormNames.LEASE_INFO]: true,
  [FormNames.RENTS]: true,
  [FormNames.SUMMARY]: true,
  [FormNames.TENANTS]: true,
});

const isSaveClickedReducer: Reducer<boolean> = handleActions({
  ['mvj/leases/RECEIVE_SAVE_CLICKED']: (state: boolean, {payload: isClicked}: ReceiveIsSaveClickedAction) => {
    return isClicked;
  },
}, false);

export default combineReducers({
  attributes: attributesReducer,
  byId: byIdReducer,
  contactModalSettings: contactModalSettingsReducer,
  current: currentLeaseReducer,
  isFormValidById: isFormValidByIdReducer,
  isContactModalOpen: isContactModalOpenReducer,
  isDeleteRelatedLeaseModalOpen: isDeleteRelatedLeaseModalOpenReducer,
  isEditMode: isEditModeReducer,
  isFetching: isFetchingReducer,
  isFetchingById: isFetchingByIdReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  isSaveClicked: isSaveClickedReducer,
  list: leasesListReducer,
});
