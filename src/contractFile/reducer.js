// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '$src/types';
import type {
  FetchContractFilesByIdAction,
  ReceiveContractFilesByIdAction,
  NotFoundByIdAction,
} from '$src/contractFile/types';

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

export default combineReducers<Object, any>({
  byId: byIdReducer,
  isFetchingById: isFetchingByIdReducer,
});
