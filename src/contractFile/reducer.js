// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Methods, Reducer} from '$src/types';
import type {
  ReceiveMethodsAction,
  FetchContractFilesByIdAction,
  ReceiveContractFilesByIdAction,
  NotFoundByIdAction,
} from '$src/contractFile/types';

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/contractFile/FETCH_ATTRIBUTES': () => true,
  'mvj/contractFile/RECEIVE_METHODS': () => false,
  'mvj/contractFile/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/contractFile/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods;
  },
}, {});

const isFetchingByIdReducer: Reducer<Object> = handleActions({
  ['mvj/contractFile/FETCH_BY_ID']: (state: Object, {payload: contractId}: FetchContractFilesByIdAction) => {
    return {
      ...state,
      [contractId]: true,
    };
  },
  ['mvj/contractFile/RECEIVE_BY_ID']: (state: Object, {payload}: ReceiveContractFilesByIdAction) => {
    return {
      ...state,
      [payload.contractId]: false,
    };
  },
  ['mvj/contractFile/NOT_FOUND_BY_ID']: (state: Object, {payload: contractId}: NotFoundByIdAction) => {
    return {
      ...state,
      [contractId]: false,
    };
  },
}, {});

const byIdReducer: Reducer<Object> = handleActions({
  ['mvj/contractFile/RECEIVE_BY_ID']: (state: Object, {payload}: ReceiveContractFilesByIdAction) => {
    return {
      ...state,
      [payload.contractId]: payload.files,
    };
  },
}, {});

export default combineReducers({
  byId: byIdReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  isFetchingById: isFetchingByIdReducer,
  methods: methodsReducer,
});
