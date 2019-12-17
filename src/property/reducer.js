// @flow
import merge from 'lodash/merge';

import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Reducer} from '$src/types';

import type {
  ReceiveIsSaveClickedAction,
  Property,
  PropertyList,
  ReceiveAttributesAction,
  ReceiveCollapseStatesAction,
  ReceivePropertyListAction,
  ReceiveSinglePropertyAction,
} from '$src/property/types';

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/property/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, null);

const isEditModeReducer: Reducer<boolean> = handleActions({
  'mvj/property/HIDE_EDIT': () => false,
  'mvj/property/SHOW_EDIT': () => true,
}, false);

const isFetchingReducer: Reducer<boolean> = handleActions({
  ['mvj/property/FETCH_ALL']: () => true,
  ['mvj/property/RECEIVE_ALL']: () => false,
  ['mvj/property/FETCH_SINGLE']: () => true,
  ['mvj/property/RECEIVE_SINGLE']: () => false,
  ['mvj/property/CREATE']: () => true,
  ['mvj/property/EDIT']: () => true,
  ['mvj/property/NOT_FOUND']: () => false,
}, false);


const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  ['mvj/property/FETCH_ATTRIBUTES']: () => true,
  ['mvj/property/RECEIVE_ATTRIBUTES']: () => false,
}, false);

const propertyListReducer: Reducer<PropertyList> = handleActions({
  ['mvj/property/RECEIVE_ALL']: (state: PropertyList, {payload: list}: ReceivePropertyListAction) => list,
}, {});

const currentPropertyReducer: Reducer<Property> = handleActions({
  ['mvj/property/RECEIVE_SINGLE']: (state: Property, {payload: property}: ReceiveSinglePropertyAction) => property,
}, {});

const collapseStatesReducer: Reducer<Object> = handleActions({
  ['mvj/property/RECEIVE_COLLAPSE_STATES']: (state: Object, {payload: states}: ReceiveCollapseStatesAction) => {
    return merge(state, states);
  },
}, {});

const isSaveClickedReducer: Reducer<boolean> = handleActions({
  ['mvj/property/RECEIVE_SAVE_CLICKED']: (state: boolean, {payload: isClicked}: ReceiveIsSaveClickedAction) => {
    return isClicked;
  },
}, false);

export default combineReducers<Object, any>({
  attributes: attributesReducer,
  collapseStates: collapseStatesReducer,
  current: currentPropertyReducer,
  isEditMode: isEditModeReducer,
  isFetching: isFetchingReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  isSaveClicked: isSaveClickedReducer,
  list: propertyListReducer,
});

