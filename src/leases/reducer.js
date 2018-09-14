// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import merge from 'lodash/merge';

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
  ReceiveFormValidFlagsAction,
  ReceiveIsSaveClickedAction,
  ReceiveCollapseStatesAction,
} from '$src/leases/types';

const isArchiveAreaModalOpenReducer: Reducer<boolean> = handleActions({
  'mvj/leases/HIDE_ARCHIVE_AREA_MODAL': () => false,
  'mvj/leases/SHOW_ARCHIVE_AREA_MODAL': () => true,
}, false);

const isUnarchiveAreaModalOpenReducer: Reducer<boolean> = handleActions({
  'mvj/leases/HIDE_UNARCHIVE_AREA_MODAL': () => false,
  'mvj/leases/SHOW_UNARCHIVE_AREA_MODAL': () => true,
}, false);

const isEditModeReducer: Reducer<boolean> = handleActions({
  'mvj/leases/HIDE_EDIT': () => false,
  'mvj/leases/SHOW_EDIT': () => true,
}, false);

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/leases/CREATE': () => true,
  'mvj/leases/PATCH': () => true,
  'mvj/leases/FETCH_ALL': () => true,
  'mvj/leases/FETCH_SINGLE': () => true,
  'mvj/leases/NOT_FOUND': () => false,
  'mvj/leases/RECEIVE_ALL': () => false,
  'mvj/leases/RECEIVE_SINGLE': () => false,
}, false);

const isArchiveFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/leases/ARCHIVE_AREA': () => true,
  'mvj/leases/UNARCHIVE_AREA': () => true,
  'mvj/leases/RECEIVE_SINGLE': () => false,
  'mvj/leases/NOT_FOUND': () => false,
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

const collapseStatesReducer: Reducer<Object> = handleActions({
  ['mvj/leases/RECEIVE_COLLAPSE_STATES']: (state: Object, {payload: states}: ReceiveCollapseStatesAction) => {
    return merge(state, states);
  },
}, {});

export default combineReducers({
  attributes: attributesReducer,
  byId: byIdReducer,
  collapseStates: collapseStatesReducer,
  current: currentLeaseReducer,
  isArchiveAreaModalOpen: isArchiveAreaModalOpenReducer,
  isArchiveFetching: isArchiveFetchingReducer,
  isFormValidById: isFormValidByIdReducer,
  isEditMode: isEditModeReducer,
  isFetching: isFetchingReducer,
  isFetchingById: isFetchingByIdReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  isSaveClicked: isSaveClickedReducer,
  isUnarchiveAreaModalOpen: isUnarchiveAreaModalOpenReducer,
  list: leasesListReducer,
});
