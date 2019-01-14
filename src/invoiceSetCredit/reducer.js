// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '../types';
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
} from '$src/invoiceSetCredit/types';


const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/invoiceSetCredit/FETCH_ATTRIBUTES': () => true,
  'mvj/invoiceSetCredit/RECEIVE_ATTRIBUTES': () => false,
  'mvj/invoiceSetCredit/RECEIVE_METHODS': () => false,
  'mvj/invoiceSetCredit/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/invoiceSetCredit/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes || {};
  },
}, {});

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/invoiceSetCredit/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods || {};
  },
}, {});


export default combineReducers({
  attributes: attributesReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  methods: methodsReducer,
});
