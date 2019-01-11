// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '../types';
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
} from './types';

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/createCollectionLetter/FETCH_ATTRIBUTES': () => true,
  'mvj/createCollectionLetter/RECEIVE_ATTRIBUTES': () => false,
  'mvj/createCollectionLetter/RECEIVE_METHODS': () => false,
  'mvj/createCollectionLetter/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/createCollectionLetter/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes || {};
  },
}, {});

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/createCollectionLetter/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods || {};
  },
}, {});


export default combineReducers({
  attributes: attributesReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  methods: methodsReducer,
});
