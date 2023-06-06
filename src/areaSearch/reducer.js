// @flow
import {combineReducers} from 'redux';
import type {Action, CombinedReducer} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '$src/types';
import type {
  AreaSearchState,
  ReceiveAreaSearchListAction, ReceiveCollapseStatesAction,
  ReceiveFormValidFlagsAction, ReceiveIsSaveClickedAction,
  ReceiveSingleAreaSearchAction,
} from '$src/areaSearch/types';
import type {ReceiveAttributesAction, ReceiveMethodsAction} from '$src/areaSearch/types';
import type {ApiResponse} from '$src/types';
import merge from 'lodash/merge';

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

const listAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/areaSearch/RECEIVE_LIST_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, null);

const listMethodsReducer: Reducer<Methods> = handleActions({
  ['mvj/areaSearch/RECEIVE_LIST_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods;
  },
}, null);

const isFetchingListAttributesReducer: Reducer<boolean> = handleActions({
  ['mvj/areaSearch/FETCH_LIST_ATTRIBUTES']: () => true,
  ['mvj/areaSearch/RECEIVE_LIST_ATTRIBUTES']: () => false,
  ['mvj/areaSearch/LIST_ATTRIBUTES_NOT_FOUND']: () => false,
  ['mvj/areaSearch/RECEIVE_LIST_METHODS']: () => false,
}, false);

const areaSearchListReducer: Reducer<ApiResponse> = handleActions({
  ['mvj/areaSearch/RECEIVE_ALL']: (state: ApiResponse, {payload: response}: ReceiveAreaSearchListAction) => {
    return response || null;
  },
}, null);

const isFetchingAreaSearchListReducer: Reducer<boolean> = handleActions({
  ['mvj/areaSearch/FETCH_ALL']: () => true,
  ['mvj/areaSearch/RECEIVE_ALL']: () => false,
  ['mvj/areaSearch/AREA_SEARCHES_NOT_FOUND']: () => false,
}, false);

const areaSearchListByBBoxReducer: Reducer<ApiResponse> = handleActions({
  ['mvj/areaSearch/RECEIVE_ALL_BY_BBOX']: (state: ApiResponse, {payload: response}: ReceiveAreaSearchListAction) => {
    return response || null;
  },
}, null);

const isFetchingAreaSearchByBBoxListReducer: Reducer<boolean> = handleActions({
  ['mvj/areaSearch/FETCH_ALL_BY_BBOX']: () => true,
  ['mvj/areaSearch/RECEIVE_ALL_BY_BBOX']: () => false,
  ['mvj/areaSearch/AREA_SEARCHES_BY_BBOX_NOT_FOUND']: () => false,
}, false);

const currentAreaSearchReducer: Reducer<Object | null> = handleActions({
  ['mvj/areaSearch/RECEIVE_SINGLE']: (state: Object, {payload: response}: ReceiveSingleAreaSearchAction) => {
    return response || null;
  },
}, null);

const isFetchingCurrentAreaSearchReducer: Reducer<boolean> = handleActions({
  ['mvj/areaSearch/FETCH_SINGLE']: () => true,
  ['mvj/areaSearch/RECEIVE_SINGLE']: () => false,
  ['mvj/areaSearch/SINGLE_AREA_SEARCH_NOT_FOUND']: () => false,
}, false);

const collapseStatesReducer: Reducer<Object> = handleActions({
  ['mvj/plotSearch/RECEIVE_COLLAPSE_STATES']: (state: Object, {payload: states}: ReceiveCollapseStatesAction) => {
    return merge(state, states);
  },
}, {});

const isSaveClickedReducer: Reducer<boolean> = handleActions({
  ['mvj/plotSearch/RECEIVE_SAVE_CLICKED']: (state: boolean, {payload: isClicked}: ReceiveIsSaveClickedAction) => {
    return isClicked;
  },
}, false);

const isEditModeReducer: Reducer<boolean> = handleActions({
  'mvj/areaSearch/HIDE_EDIT': () => false,
  'mvj/areaSearch/SHOW_EDIT': () => true,
}, false);

const isFormValidByIdReducer: Reducer<Object> = handleActions({
  ['mvj/areaSearch/RECEIVE_FORM_VALID_FLAGS']: (state: Object, {payload: valid}: ReceiveFormValidFlagsAction) => {
    return {
      ...state,
      ...valid,
    };
  },
  ['mvj/areaSearch/CLEAR_FORM_VALID_FLAGS']: () => {
    return {};
  },
}, {});

const isBatchEditingAreaSearchInfoChecksReducer: Reducer<boolean> = handleActions({
  ['mvj/areaSearch/BATCH_EDIT_INFO_CHECKS']: () => true,
  ['mvj/areaSearch/RECEIVE_INFO_CHECKS_BATCH_EDIT_SUCCESS']: () => false,
  ['mvj/areaSearch/RECEIVE_INFO_CHECKS_BATCH_EDIT_FAILURE']: () => false,
}, false);

export default (combineReducers<Object, Action<any>>({
  attributes: attributesReducer,
  methods: methodsReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  listAttributes: listAttributesReducer,
  listMethods: listMethodsReducer,
  isFetchingListAttributes: isFetchingListAttributesReducer,
  areaSearchList: areaSearchListReducer,
  isFetchingAreaSearchList: isFetchingAreaSearchListReducer,
  areaSearchListByBBox: areaSearchListByBBoxReducer,
  isFetchingAreaSearchListByBBox: isFetchingAreaSearchByBBoxListReducer,
  currentAreaSearch: currentAreaSearchReducer,
  isFetchingCurrentAreaSearch: isFetchingCurrentAreaSearchReducer,
  isEditMode: isEditModeReducer,
  isFormValidById: isFormValidByIdReducer,
  collapseStates: collapseStatesReducer,
  isSaveClicked: isSaveClickedReducer,
  isBatchEditingAreaSearchInfoChecks: isBatchEditingAreaSearchInfoChecksReducer,
}): CombinedReducer<AreaSearchState, Action<any>>);
