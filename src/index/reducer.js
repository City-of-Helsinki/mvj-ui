// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '$src/types';
import type {
  IndexList,
  ReceiveIndexListAction,
} from '$src/index/types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/index/FETCH_ALL': () => true,
  'mvj/index/RECEIVE_ALL': () => false,
  'mvj/index/NOT_FOUND': () => false,
}, false);

const listReducer: Reducer<IndexList> = handleActions({
  ['mvj/index/RECEIVE_ALL']: (state: IndexList, {payload}: ReceiveIndexListAction) => {
    return payload;
  },
}, []);

export default combineReducers<Object, any>({
  isFetching: isFetchingReducer,
  list: listReducer,
});
