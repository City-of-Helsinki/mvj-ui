// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '$src/types';
import type {
  UiDataList,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  ReceiveUiDataListAction,
} from '$src/uiData/types';

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/uiData/FETCH_ATTRIBUTES': () => true,
  'mvj/uiData/RECEIVE_METHODS': () => false,
  'mvj/uiData/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  'mvj/uiData/RECEIVE_ATTRIBUTES': (state: Attributes, {payload}: ReceiveAttributesAction) => {
    return payload;
  },
}, null);

const methodsReducer: Reducer<Methods> = handleActions({
  'mvj/uiData/RECEIVE_METHODS': (state: Methods, {payload}: ReceiveMethodsAction) => {
    return payload;
  },
}, null);

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/uiData/FETCH_ALL': () => true,
  'mvj/uiData/CREATE': () => true,
  'mvj/uiData/DELETE': () => true,
  'mvj/uiData/EDIT': () => true,
  'mvj/uiData/RECEIVE_ALL': () => false,
  'mvj/uiData/NOT_FOUND': () => false,
}, false);

const listReducer: Reducer<UiDataList> = handleActions({
  'mvj/uiData/RECEIVE_ALL': (state: UiDataList, {payload}: ReceiveUiDataListAction) => {
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
