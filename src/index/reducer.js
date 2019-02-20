// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '$src/types';
import type {
  IndexList,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  ReceiveIndexListAction,
} from '$src/index/types';

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/index/FETCH_ATTRIBUTES': () => true,
  'mvj/index/RECEIVE_METHODS': () => false,
  'mvj/index/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/index/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload}: ReceiveAttributesAction) => {
    return payload;
  },
}, null);

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/index/RECEIVE_METHODS']: (state: Methods, {payload}: ReceiveMethodsAction) => {
    return payload;
  },
}, null);

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
  attributes: attributesReducer,
  isFetching: isFetchingReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  list: listReducer,
  methods: methodsReducer,
});
