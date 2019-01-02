// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import merge from 'lodash/merge';

import {FormNames} from '$src/leases/enums';

import type {Attributes, Methods, Reducer} from '$src/types';
import type {
  Lease,
  LeaseList,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  ReceiveLeasesAction,
  ReceiveSingleLeaseAction,
  FetchLeaseByIdAction,
  ReceiveLeaseByIdAction,
  LeaseNotFoundByIdAction,
  ReceiveFormValidFlagsAction,
  ReceiveIsSaveClickedAction,
  ReceiveCollapseStatesAction,
} from '$src/leases/types';

const isEditModeReducer: Reducer<boolean> = handleActions({
  'mvj/leases/HIDE_EDIT': () => false,
  'mvj/leases/SHOW_EDIT': () => true,
}, false);

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/leases/CREATE': () => true,
  'mvj/leases/FETCH_ALL': () => true,
  'mvj/leases/FETCH_SINGLE': () => true,
  'mvj/leases/NOT_FOUND': () => false,
  'mvj/leases/RECEIVE_ALL': () => false,
  'mvj/leases/RECEIVE_SINGLE': () => false,
}, false);

const isSavingReducer: Reducer<boolean> = handleActions({
  'mvj/leases/PATCH': () => true,
  'mvj/leases/START_INVOICING': () => true,
  'mvj/leases/STOP_INVOICING': () => true,
  'mvj/leases/SET_RENT_INFO_COMPLETE': () => true,
  'mvj/leases/SET_RENT_INFO_UNCOMPLETE': () => true,
  'mvj/leases/COPY_AREAS_TO_CONTRACT': () => true,
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
  'mvj/leases/RECEIVE_METHODS': () => false,
  'mvj/leases/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/leases/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, {});

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/leases/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods;
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
  isSaving: isSavingReducer,
  isFormValidById: isFormValidByIdReducer,
  isEditMode: isEditModeReducer,
  isFetching: isFetchingReducer,
  isFetchingById: isFetchingByIdReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  isSaveClicked: isSaveClickedReducer,
  list: leasesListReducer,
  methods: methodsReducer,
});
