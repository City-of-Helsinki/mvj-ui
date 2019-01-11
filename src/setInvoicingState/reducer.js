// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '../types';
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
} from '$src/previewInvoices/types';


const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/setInvoicingState/FETCH_ATTRIBUTES': () => true,
  'mvj/setInvoicingState/RECEIVE_ATTRIBUTES': () => false,
  'mvj/setInvoicingState/RECEIVE_METHODS': () => false,
  'mvj/setInvoicingState/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/setInvoicingState/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes || {};
  },
}, {});

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/setInvoicingState/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods || {};
  },
}, {});


export default combineReducers({
  attributes: attributesReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  methods: methodsReducer,
});
