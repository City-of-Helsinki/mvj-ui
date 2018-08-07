// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  Attributes,
  ReceiveAttributesAction,
  Invoice,
  InvoiceList,
  ReceiveInvoicesAction,
  ReceiveIsCreateInvoicePanelOpenAction,
  ReceiveIsCreditInvoicePanelOpenAction,
  ReceivePatchedInvoiceAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/invoices/CREATE': () => true,
  'mvj/invoices/PATCH': () => true,
  'mvj/invoices/FETCH_ALL': () => true,
  'mvj/invoices/NOT_FOUND': () => false,
  'mvj/invoices/RECEIVE_ALL': () => false,
}, false);

const isCreatePanelOpenReducer: Reducer<boolean> = handleActions({
  ['mvj/invoices/RECEIVE_IS_CREATE_PANEL_OPEN']: (state: boolean, {payload: isOpen}: ReceiveIsCreateInvoicePanelOpenAction) => {
    return isOpen;
  },
}, false);

const isCreditPanelOpenReducer: Reducer<boolean> = handleActions({
  ['mvj/invoices/RECEIVE_IS_CREDIT_PANEL_OPEN']: (state: boolean, {payload: isOpen}: ReceiveIsCreditInvoicePanelOpenAction) => {
    return isOpen;
  },
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/invoices/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, {});

const invoicesReducer: Reducer<InvoiceList> = handleActions({
  ['mvj/invoices/RECEIVE_ALL']: (state: InvoiceList, {payload: invoices}: ReceiveInvoicesAction) => {
    return invoices;
  },
}, []);

const patchedInvoiceReducer: Reducer<?Invoice> = handleActions({
  ['mvj/invoices/RECEIVE_PATCHED']: (state: ?Invoice, {payload: invoice}: ReceivePatchedInvoiceAction) => {
    return invoice;
  },
  'mvj/invoices/CLEAR_PATCHED': () => null,
}, null);

export default combineReducers({
  attributes: attributesReducer,
  invoices: invoicesReducer,
  isCreatePanelOpen: isCreatePanelOpenReducer,
  isCreditPanelOpen: isCreditPanelOpenReducer,
  isFetching: isFetchingReducer,
  patchedInvoice: patchedInvoiceReducer,
});
