// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import isArray from 'lodash/isArray';

import type {Attributes, Methods, Reducer} from '../types';
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  RentForPeriod,
  ReceiveRentForPeriodByLeaseAction,
  DeleteRentForPeriodByLeaseAction,
  ReceiveIsSaveClickedAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/rentforperiod/FETCH_ALL': () => true,
  'mvj/rentforperiod/RECEIVE_BY_LEASE': () => false,
  'mvj/rentforperiod/NOT_FOUND': () => false,
}, false);

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/rentforperiod/FETCH_ATTRIBUTES': () => true,
  'mvj/rentforperiod/RECEIVE_ATTRIBUTES': () => false,
  'mvj/rentforperiod/RECEIVE_METHODS': () => false,
  'mvj/rentforperiod/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/rentforperiod/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes || {};
  },
}, {});

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/rentforperiod/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods || {};
  },
}, {});

const isSaveClickedReducer: Reducer<boolean> = handleActions({
  ['mvj/rentforperiod/RECEIVE_SAVE_CLICKED']: (state: boolean, {payload: isClicked}: ReceiveIsSaveClickedAction) => {
    return isClicked;
  },
}, false);

const byLeaseReducer: Reducer<RentForPeriod> = handleActions({
  ['mvj/rentforperiod/RECEIVE_BY_LEASE']: (state: RentForPeriod, {payload}: ReceiveRentForPeriodByLeaseAction) => {
    const rents = isArray(state[payload.leaseId]) ? [...state[payload.leaseId], payload.rent] : [payload.rent];

    return {
      ...state,
      [payload.leaseId]: rents,
    };
  },
  ['mvj/rentforperiod/DELETE_BY_LEASE']: (state: RentForPeriod, {payload}: DeleteRentForPeriodByLeaseAction) => {
    const rents = isArray(state[payload.leaseId])
      ? state[payload.leaseId].filter((rent) => rent.id !== payload.id)
      : [];

    return {
      ...state,
      [payload.leaseId]: rents,
    };
  },
}, {});

export default combineReducers({
  attributes: attributesReducer,
  byLease: byLeaseReducer,
  isFetching: isFetchingReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  isSaveClicked: isSaveClickedReducer,
  methods: methodsReducer,
});
