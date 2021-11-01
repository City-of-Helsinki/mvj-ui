// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '../types';
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
} from './types';

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/landUseAgreementAttachment/FETCH_ATTRIBUTES': () => true,
  'mvj/landUseAgreementAttachment/ATTRIBUTES_NOT_FOUND': () => false,
  'mvj/landUseAgreementAttachment/RECEIVE_ATTRIBUTES': () => false,
  'mvj/landUseAgreementAttachment/RECEIVE_METHODS': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/landUseAgreementAttachment/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, null);

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/landUseAgreementAttachment/RECEIVE_METHODS']: (state: Attributes, {payload: methods}: ReceiveMethodsAction) => {
    return methods;
  },
}, null);

export default combineReducers<Object, any>({
  attributes: attributesReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  methods: methodsReducer,
});
