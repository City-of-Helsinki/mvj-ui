// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';

import type {
  RememberableTermList,
  ReceiveRememberableTermListAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/rememberableterm/FETCH_ALL': () => true,
  'mvj/rememberableterm/RECEIVE_ALL': () => false,
  'mvj/rememberableterm/NOT_FOUND': () => false,
}, false);

const rememberableTermListReducer: Reducer<RememberableTermList> = handleActions({
  ['mvj/rememberableterm/RECEIVE_ALL']: (state: RememberableTermList, {payload: list}: ReceiveRememberableTermListAction) => {
    return list;
  },
}, []);

export default combineReducers({
  isFetching: isFetchingReducer,
  list: rememberableTermListReducer,
});
