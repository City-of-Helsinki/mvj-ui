// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '../types';
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
} from '$src/setRentInfoCompletionState/types';


const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/setRentInfoCompletionState/FETCH_ATTRIBUTES': () => true,
  'mvj/setRentInfoCompletionState/RECEIVE_ATTRIBUTES': () => false,
  'mvj/setRentInfoCompletionState/RECEIVE_METHODS': () => false,
  'mvj/setRentInfoCompletionState/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/setRentInfoCompletionState/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes || {};
  },
}, {});

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/setRentInfoCompletionState/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods || {};
  },
}, {});


export default combineReducers({
  attributes: attributesReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  methods: methodsReducer,
});
