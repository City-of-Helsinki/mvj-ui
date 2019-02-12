// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '../types';
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
} from './types';

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/copyAreasToContract/FETCH_ATTRIBUTES': () => true,
  'mvj/copyAreasToContract/RECEIVE_ATTRIBUTES': () => false,
  'mvj/copyAreasToContract/RECEIVE_METHODS': () => false,
  'mvj/copyAreasToContract/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/copyAreasToContract/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes || {};
  },
}, {});

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/copyAreasToContract/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods || {};
  },
}, {});


export default combineReducers<Object, any>({
  attributes: attributesReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  methods: methodsReducer,
});
