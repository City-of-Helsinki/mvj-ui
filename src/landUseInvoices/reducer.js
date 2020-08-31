// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import merge from 'lodash/merge';

import type {Attributes, Methods, Reducer} from '../types';
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  Invoice,
  InvoiceListMap,
  ReceiveInvoicesByLandUseContractAction,
  ReceiveInvoiceToCreditAction,
  ReceiveIsCreateInvoicePanelOpenAction,
  ReceiveIsCreditInvoicePanelOpenAction,
  ReceiveIsCreateClickedAction,
  ReceiveIsCreditClickedAction,
  ReceiveIsEditClickedAction,
  ReceivePatchedInvoiceAction,
  ReceiveCollapseStatesAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/landUseInvoices/CREATE': () => true,
  'mvj/landUseInvoices/FETCH_BY_LAND_USE_CONTRACT': () => true,
  'mvj/landUseInvoices/NOT_FOUND': () => false,
  'mvj/landUseInvoices/RECEIVE_BY_LEASE': () => false,
}, false);

const isSavingReducer: Reducer<boolean> = handleActions({
  'mvj/landUseInvoices/PATCH': () => true,
  'mvj/landUseInvoices/EXPORT_TO_LASKE_AND_UPDATE': () => true,
  'mvj/landUseInvoices/NOT_FOUND': () => false,
  'mvj/landUseInvoices/RECEIVE_BY_LEASE': () => false,
  'mvj/landUseInvoices/DELETE': () => true,
  'mvj/landUseInvoices/START_INVOICING': () => true,
  'mvj/landUseInvoices/STOP_INVOICING': () => true,
}, false);

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/landUseInvoices/FETCH_ATTRIBUTES': () => true,
  'mvj/landUseInvoices/RECEIVE_ATTRIBUTES': () => false,
  'mvj/landUseInvoices/RECEIVE_METHODS': () => false,
  'mvj/landUseInvoices/ATTRIBUTES_NOT_FOUND': () => false,
}, false);

const isCreatePanelOpenReducer: Reducer<boolean> = handleActions({
  ['mvj/landUseInvoices/RECEIVE_IS_CREATE_PANEL_OPEN']: (state: boolean, {payload: isOpen}: ReceiveIsCreateInvoicePanelOpenAction) => {
    return isOpen;
  },
}, false);

const isCreditPanelOpenReducer: Reducer<boolean> = handleActions({
  ['mvj/landUseInvoices/RECEIVE_IS_CREDIT_PANEL_OPEN']: (state: boolean, {payload: isOpen}: ReceiveIsCreditInvoicePanelOpenAction) => {
    return isOpen;
  },
}, false);

const isCreateClickedReducer: Reducer<boolean> = handleActions({
  ['mvj/landUseInvoices/RECEIVE_CREATE_CLICKED']: (state: boolean, {payload: isClicked}: ReceiveIsCreateClickedAction) => {
    return isClicked;
  },
}, false);

const isCreditClickedReducer: Reducer<boolean> = handleActions({
  ['mvj/landUseInvoices/RECEIVE_CREDIT_CLICKED']: (state: boolean, {payload: isClicked}: ReceiveIsCreditClickedAction) => {
    return isClicked;
  },
}, false);

const isEditClickedReducer: Reducer<boolean> = handleActions({
  ['mvj/landUseInvoices/RECEIVE_EDIT_CLICKED']: (state: boolean, {payload: isClicked}: ReceiveIsEditClickedAction) => {
    return isClicked;
  },
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/landUseInvoices/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, null);

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/landUseInvoices/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods;
  },
}, null);

const byLandUseContractReducer: Reducer<InvoiceListMap> = handleActions({
  ['mvj/landUseInvoices/RECEIVE_BY_LAND_USE_CONTRACT']: (state: InvoiceListMap, {payload}: ReceiveInvoicesByLandUseContractAction) => {
    return {
      ...state,
      [payload.leaseId]: payload.invoices,
    };
  },
}, {});

const invoiceToCreditReducer: Reducer<?string> = handleActions({
  ['mvj/landUseInvoices/RECEIVE_INVOICE_TO_CREDIT']: (state: ?string, {payload: invoiceId}: ReceiveInvoiceToCreditAction) => {
    return invoiceId;
  },
}, null);

const patchedInvoiceReducer: Reducer<?Invoice> = handleActions({
  ['mvj/landUseInvoices/RECEIVE_PATCHED']: (state: ?Invoice, {payload: invoice}: ReceivePatchedInvoiceAction) => {
    return invoice;
  },
  'mvj/landUseInvoices/CLEAR_PATCHED': () => null,
}, null);

const collapseStatesReducer: Reducer<Object> = handleActions({
  ['mvj/landUseInvoices/RECEIVE_COLLAPSE_STATES']: (state: Object, {payload: states}: ReceiveCollapseStatesAction) => {
    return merge(state, states);
  },
}, {});

export default combineReducers<Object, any>({
  attributes: attributesReducer,
  byLandUseContract: byLandUseContractReducer,
  invoiceToCredit: invoiceToCreditReducer,
  isCreateClicked: isCreateClickedReducer,
  isCreatePanelOpen: isCreatePanelOpenReducer,
  isCreditClicked: isCreditClickedReducer,
  isCreditPanelOpen: isCreditPanelOpenReducer,
  isSaving: isSavingReducer,
  isEditClicked: isEditClickedReducer,
  isFetching: isFetchingReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  methods: methodsReducer,
  patchedInvoice: patchedInvoiceReducer,
  collapseStates: collapseStatesReducer,
});
