import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import merge from "lodash/merge";
import { FormNames } from "enums";
import type { Attributes, Methods, Reducer } from "types";
import type { Lease, LeaseList, ReceiveAttributesAction, ReceiveMethodsAction, ReceiveLeasesAction, ReceiveLeasesByBBoxAction, ReceiveSingleLeaseAction, FetchLeaseByIdAction, ReceiveLeaseByIdAction, LeaseNotFoundByIdAction, ReceiveFormValidFlagsAction, ReceiveIsSaveClickedAction, ReceiveCollapseStatesAction, ReceiveLeasesForContractNumbersAction } from "/src/leases/types";
const isAttachDecisionModalOpenReducer: Reducer<boolean> = handleActions({
  'mvj/leases/HIDE_ATTACH_DECISION_MODAL': () => false,
  'mvj/leases/SHOW_ATTACH_DECISION_MODAL': () => true
}, false);
const isCreateModalOpenReducer: Reducer<boolean> = handleActions({
  'mvj/leases/HIDE_CREATE_MODAL': () => false,
  'mvj/leases/SHOW_CREATE_MODAL': () => true
}, false);
const isEditModeReducer: Reducer<boolean> = handleActions({
  'mvj/leases/HIDE_EDIT': () => false,
  'mvj/leases/SHOW_EDIT': () => true
}, false);
const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/leases/CREATE': () => true,
  'mvj/leases/FETCH_ALL': () => true,
  'mvj/leases/FETCH_SINGLE': () => true,
  'mvj/leases/NOT_FOUND': () => false,
  'mvj/leases/RECEIVE_ALL': () => false,
  'mvj/leases/RECEIVE_SINGLE': () => false
}, false);
const isFetchingByBBoxReducer: Reducer<boolean> = handleActions({
  'mvj/leases/FETCH_BY_BBOX': () => true,
  'mvj/leases/NOT_FOUND_BY_BBOX': () => false,
  'mvj/leases/RECEIVE_BY_BBOX': () => false
}, false);
const isSavingReducer: Reducer<boolean> = handleActions({
  'mvj/leases/DELETE': () => true,
  'mvj/leases/PATCH': () => true,
  'mvj/leases/CREATE_AND_UPDATE': () => true,
  'mvj/leases/PATCH_INVOICE_NOTES': () => true,
  'mvj/leases/START_INVOICING': () => true,
  'mvj/leases/STOP_INVOICING': () => true,
  'mvj/leases/SET_RENT_INFO_COMPLETE': () => true,
  'mvj/leases/SET_RENT_INFO_UNCOMPLETE': () => true,
  'mvj/leases/COPY_AREAS_TO_CONTRACT': () => true,
  'mvj/leases/COPY_DECISION_TO_LEASES': () => true,
  'mvj/leases/SEND_EMAIL': () => true,
  'mvj/leases/RECEIVE_SINGLE': () => false,
  'mvj/leases/NOT_FOUND': () => false
}, false);
const isFetchingByIdReducer: Reducer<Record<string, any>> = handleActions({
  ['mvj/leases/FETCH_BY_ID']: (state: Record<string, any>, {
    payload: id
  }: FetchLeaseByIdAction) => {
    return { ...state,
      [id]: true
    };
  },
  ['mvj/leases/RECEIVE_BY_ID']: (state: Record<string, any>, {
    payload
  }: ReceiveLeaseByIdAction) => {
    return { ...state,
      [payload.leaseId]: false
    };
  },
  ['mvj/leases/NOT_FOUND_BY_ID']: (state: Record<string, any>, {
    payload: id
  }: LeaseNotFoundByIdAction) => {
    return { ...state,
      [id]: false
    };
  }
}, {});
const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/leases/FETCH_ATTRIBUTES': () => true,
  'mvj/leases/RECEIVE_METHODS': () => false,
  'mvj/leases/ATTRIBUTES_NOT_FOUND': () => false
}, false);
const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/leases/RECEIVE_ATTRIBUTES']: (state: Attributes, {
    payload: attributes
  }: ReceiveAttributesAction) => {
    return attributes;
  }
}, null);
const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/leases/RECEIVE_METHODS']: (state: Methods, {
    payload: methods
  }: ReceiveMethodsAction) => {
    return methods;
  }
}, null);
const leasesListReducer: Reducer<LeaseList> = handleActions({
  ['mvj/leases/RECEIVE_ALL']: (state: LeaseList, {
    payload: leases
  }: ReceiveLeasesAction) => {
    return leases;
  }
}, null);
const listByBBoxReducer: Reducer<LeaseList> = handleActions({
  ['mvj/leases/RECEIVE_BY_BBOX']: (state: LeaseList, {
    payload: leases
  }: ReceiveLeasesByBBoxAction) => {
    return leases;
  }
}, null);
const currentLeaseReducer: Reducer<Lease> = handleActions({
  ['mvj/leases/RECEIVE_SINGLE']: (state: Lease, {
    payload: lease
  }: ReceiveSingleLeaseAction) => {
    return lease;
  }
}, {});
const byIdReducer: Reducer<Lease> = handleActions({
  ['mvj/leases/RECEIVE_BY_ID']: (state: Lease, {
    payload
  }: ReceiveLeaseByIdAction) => {
    return { ...state,
      [payload.leaseId]: payload.lease
    };
  }
}, {});
const isFormValidByIdReducer: Reducer<Record<string, any>> = handleActions({
  ['mvj/leases/RECEIVE_FORM_VALID_FLAGS']: (state: Record<string, any>, {
    payload: valid
  }: ReceiveFormValidFlagsAction) => {
    return { ...state,
      ...valid
    };
  },
  ['mvj/leases/CLEAR_FORM_VALID_FLAGS']: () => {
    return {
      [FormNames.LEASE_CONSTRUCTABILITY]: true,
      [FormNames.LEASE_CONTRACTS]: true,
      [FormNames.LEASE_DECISIONS]: true,
      [FormNames.LEASE_INSPECTIONS]: true,
      [FormNames.LEASE_AREAS]: true,
      [FormNames.LEASE_RENTS]: true,
      [FormNames.LEASE_SUMMARY]: true,
      [FormNames.LEASE_TENANTS]: true
    };
  }
}, {
  [FormNames.LEASE_CONSTRUCTABILITY]: true,
  [FormNames.LEASE_CONTRACTS]: true,
  [FormNames.LEASE_DECISIONS]: true,
  [FormNames.LEASE_INSPECTIONS]: true,
  [FormNames.LEASE_AREAS]: true,
  [FormNames.LEASE_RENTS]: true,
  [FormNames.LEASE_SUMMARY]: true,
  [FormNames.LEASE_TENANTS]: true
});
const isSaveClickedReducer: Reducer<boolean> = handleActions({
  ['mvj/leases/RECEIVE_SAVE_CLICKED']: (state: boolean, {
    payload: isClicked
  }: ReceiveIsSaveClickedAction) => {
    return isClicked;
  }
}, false);
const collapseStatesReducer: Reducer<Record<string, any>> = handleActions({
  ['mvj/leases/RECEIVE_COLLAPSE_STATES']: (state: Record<string, any>, {
    payload: states
  }: ReceiveCollapseStatesAction) => {
    return merge(state, states);
  }
}, {});
const leasesForContractNumbersReducer: Reducer<LeaseList> = handleActions({
  ['mvj/leases/RECEIVE_LEASES_FOR_CONTRACT_NUMBERS']: (state: LeaseList, {
    payload: leases
  }: ReceiveLeasesForContractNumbersAction) => {
    return leases;
  }
}, null);
const isFetchingLeasesForContractNumbersReducer: Reducer<boolean> = handleActions({
  'mvj/leases/FETCH_LEASES_FOR_CONTRACT_NUMBERS': () => true,
  'mvj/leases/RECEIVE_LEASES_FOR_CONTRACT_NUMBERS': () => false,
  'mvj/leases/NOT_FOUND': () => false
}, false);
export default combineReducers<Record<string, any>, any>({
  attributes: attributesReducer,
  byId: byIdReducer,
  collapseStates: collapseStatesReducer,
  current: currentLeaseReducer,
  isAttachDecisionModalOpen: isAttachDecisionModalOpenReducer,
  isCreateModalOpen: isCreateModalOpenReducer,
  isFormValidById: isFormValidByIdReducer,
  isEditMode: isEditModeReducer,
  isFetching: isFetchingReducer,
  isFetchingByBBox: isFetchingByBBoxReducer,
  isFetchingById: isFetchingByIdReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  isSaveClicked: isSaveClickedReducer,
  isSaving: isSavingReducer,
  list: leasesListReducer,
  listByBBox: listByBBoxReducer,
  methods: methodsReducer,
  leasesForContractNumbers: leasesForContractNumbersReducer,
  isFetchingLeasesForContractNumbers: isFetchingLeasesForContractNumbersReducer
});