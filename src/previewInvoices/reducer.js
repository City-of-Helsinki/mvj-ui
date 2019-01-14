// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Attributes, Methods, Reducer} from '../types';
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  PreviewInvoices,
  ReceivePreviewInvoicesAction,
} from '$src/previewInvoices/types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/previewInvoices/FETCH_ALL': () => true,
  'mvj/previewInvoices/NOT_FOUND': () => false,
  'mvj/previewInvoices/RECEIVE_ALL': () => false,
}, false);

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/previewInvoices/FETCH_ATTRIBUTES': () => true,
  'mvj/previewInvoices/RECEIVE_ATTRIBUTES': () => false,
  'mvj/previewInvoices/RECEIVE_METHODS': () => false,
  'mvj/previewInvoices/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/previewInvoices/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes || {};
  },
}, {});

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/previewInvoices/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods || {};
  },
}, {});

const previewInvoicesListReducer: Reducer<PreviewInvoices> = handleActions({
  ['mvj/previewInvoices/RECEIVE_ALL']: (state: PreviewInvoices, {payload: previewInvoices}: ReceivePreviewInvoicesAction) => {
    return previewInvoices;
  },
  ['mvj/previewInvoices/CLEAR']: () => null,
}, null);

export default combineReducers({
  attributes: attributesReducer,
  isFetching: isFetchingReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  list: previewInvoicesListReducer,
  methods: methodsReducer,
});
