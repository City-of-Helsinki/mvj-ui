// @flow
import {handleActions} from 'redux-actions';
import {combineReducers} from 'redux';

import type {Reducer} from '../types';
import type {
  ReceiveApiTokenAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/auth/FETCH_API_TOKEN': () => true,
  'mvj/auth/TOKEN_NOT_FOUND': () => false,
  'mvj/auth/RECEIVE_API_TOKEN': () => false,
}, false);

const apiTokenReducer: Reducer<Object> = handleActions({
  ['mvj/auth/RECEIVE_API_TOKEN']: (state: Object, {payload}: ReceiveApiTokenAction) => payload,
}, {});

export default combineReducers<Object, any>({
  apiToken: apiTokenReducer,
  isFetching: isFetchingReducer,
});
