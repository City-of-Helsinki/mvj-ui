// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '$src/types';
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
} from '$src/leaseholdTransfer/types';

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/leaseholdTransfer/FETCH_ATTRIBUTES': () => true,
  'mvj/leaseholdTransfer/RECEIVE_METHODS': () => false,
  'mvj/leaseholdTransfer/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/leaseholdTransfer/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, null);

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/leaseholdTransfer/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods;
  },
}, null);

export default combineReducers<Object, any>({
  attributes: attributesReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  methods: methodsReducer,
});
