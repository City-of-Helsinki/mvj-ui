// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '../types';
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
} from '$src/invoiceCredit/types';


const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/invoiceCredit/FETCH_ATTRIBUTES': () => true,
  'mvj/invoiceCredit/RECEIVE_ATTRIBUTES': () => false,
  'mvj/invoiceCredit/RECEIVE_METHODS': () => false,
  'mvj/invoiceCredit/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/invoiceCredit/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes || {};
  },
}, {});

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/invoiceCredit/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods || {};
  },
}, {});


export default combineReducers({
  attributes: attributesReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  methods: methodsReducer,
});
