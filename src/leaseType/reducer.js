// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '$src/types';
import type {LeaseTypeList, ReceiveLeaseTypesAction} from '$src/leaseType/types';


const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/leaseType/FETCH_ALL': () => true,
  'mvj/leaseType/NOT_FOUND': () => false,
  'mvj/leaseType/RECEIVE_ALL': () => false,
}, false);

const leaseTypeListReducer: Reducer<LeaseTypeList> = handleActions({
  ['mvj/leaseType/RECEIVE_ALL']: (state: LeaseTypeList, {payload: leaseTypes}: ReceiveLeaseTypesAction) => {
    return leaseTypes;
  },
}, []);

export default combineReducers({
  isFetching: isFetchingReducer,
  list: leaseTypeListReducer,
});
