// @flow
import {combineReducers} from 'redux';
import type {Action, CombinedReducer} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '$src/types';
import type {AreaSearchState, ReceiveAreaSearchListAction} from '$src/areaSearch/types';
import type {ReceiveAttributesAction, ReceiveMethodsAction} from '$src/areaSearch/types';
import type {ApiResponse} from '$src/types';

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/areaSearch/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, null);

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/areaSearch/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods;
  },
}, null);

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  ['mvj/areaSearch/FETCH_ATTRIBUTES']: () => true,
  ['mvj/areaSearch/RECEIVE_ATTRIBUTES']: () => false,
  ['mvj/areaSearch/ATTRIBUTES_NOT_FOUND']: () => false,
  ['mvj/areaSearch/RECEIVE_METHODS']: () => false,
}, false);

const areaSearchListReducer: Reducer<ApiResponse | null> = handleActions({
  ['mvj/areaSearch/RECEIVE_ALL']: (state: ApiResponse | null, {payload: response}: ReceiveAreaSearchListAction) => {
    return response || null;
  },
}, null);

const isFetchingAreaSearchListReducer: Reducer<boolean> = handleActions({
  ['mvj/areaSearch/FETCH_ALL']: () => true,
  ['mvj/areaSearch/RECEIVE_ALL']: () => false,
  ['mvj/areaSearch/AREA_SEARCHES_NOT_FOUND']: () => false,
}, false);

export default (combineReducers<Object, Action<any>>({
  attributes: attributesReducer,
  methods: methodsReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  areaSearchList: areaSearchListReducer,
  isFetchingAreaSearchList: isFetchingAreaSearchListReducer,
}): CombinedReducer<AreaSearchState, Action<any>>);
