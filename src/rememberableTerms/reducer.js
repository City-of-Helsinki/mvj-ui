// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';

import type {
  RememberableTermList,
  ReceiveRememberableTermListAction,
  InitializeAction,
} from './types';

const initialValuesReducer: Reducer<Object> = handleActions({
  ['mvj/rememberableterm/INITIALIZE']: (state: Object, {payload: values}: InitializeAction) => {
    return values;
  },
}, {
  comment: '',
  id: -1,
  geoJSON: {},
  isNew: true,
});

const isEditModeReducer: Reducer<boolean> = handleActions({
  'mvj/rememberableterm/SHOW_EDIT_MODE': () => true,
  'mvj/rememberableterm/HIDE_EDIT_MODE': () => false,
}, false);

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/rememberableterm/FETCH_ALL': () => true,
  'mvj/rememberableterm/RECEIVE_ALL': () => false,
  'mvj/rememberableterm/CREATE': () => true,
  'mvj/rememberableterm/DELETE': () => true,
  'mvj/rememberableterm/EDIT': () => true,
  'mvj/rememberableterm/NOT_FOUND': () => false,
}, false);

const rememberableTermListReducer: Reducer<RememberableTermList> = handleActions({
  ['mvj/rememberableterm/RECEIVE_ALL']: (state: RememberableTermList, {payload: list}: ReceiveRememberableTermListAction) => {
    return list;
  },
}, []);

export default combineReducers({
  initialValues: initialValuesReducer,
  isEditMode: isEditModeReducer,
  isFetching: isFetchingReducer,
  list: rememberableTermListReducer,
});
