// @flow

import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {ApiError, ReceiveErrorAction} from './types';

export const errorReducer: Reducer<ApiError> = handleActions({
  ['mvj/api/RECEIVE_ERROR']: (state, {payload: error}: ReceiveErrorAction) => error,
  ['mvj/api/CLEAR_ERROR']: () => null,
}, null);

export default combineReducers<Object, any>({
  error: errorReducer,
});
