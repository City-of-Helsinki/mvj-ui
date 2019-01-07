// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '../types';
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
} from './types';

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/infillDevelopmentAttachment/FETCH_ATTRIBUTES': () => true,
  'mvj/infillDevelopmentAttachment/ATTRIBUTES_NOT_FOUND': () => false,
  'mvj/infillDevelopmentAttachment/RECEIVE_ATTRIBUTES': () => false,
  'mvj/infillDevelopmentAttachment/RECEIVE_METHODS': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/infillDevelopmentAttachment/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, {});

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/infillDevelopmentAttachment/RECEIVE_METHODS']: (state: Attributes, {payload: methods}: ReceiveMethodsAction) => {
    return methods;
  },
}, {});

export default combineReducers({
  attributes: attributesReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  methods: methodsReducer,
});
