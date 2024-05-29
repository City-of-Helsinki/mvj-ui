import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Attributes, Methods, Reducer } from "types";
import type { InvoiceNoteList, ReceiveAttributesAction, ReceiveMethodsAction, ReceiveInvoiceNoteListAction } from "./types";
const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/invoiceNote/FETCH_ATTRIBUTES': () => true,
  'mvj/invoiceNote/RECEIVE_ATTRIBUTES': () => false,
  'mvj/invoiceNote/RECEIVE_METHODS': () => false,
  'mvj/invoiceNote/ATTRIBUTES_NOT_FOUND': () => false
}, false);
const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/invoiceNote/RECEIVE_ATTRIBUTES']: (state: Attributes, {
    payload: attributes
  }: ReceiveAttributesAction) => {
    return attributes;
  }
}, null);
const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/invoiceNote/RECEIVE_METHODS']: (state: Methods, {
    payload: methods
  }: ReceiveMethodsAction) => {
    return methods;
  }
}, null);
const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/invoiceNote/FETCH_ALL': () => true,
  'mvj/invoiceNote/CREATE_AND_FETCH': () => true,
  'mvj/invoiceNote/RECEIVE_ALL': () => false,
  'mvj/invoiceNote/NOT_FOUND': () => false
}, false);
const listReducer: Reducer<InvoiceNoteList> = handleActions({
  ['mvj/invoiceNote/RECEIVE_ALL']: (state: InvoiceNoteList, {
    payload: invoiceNotes
  }: ReceiveInvoiceNoteListAction) => {
    return invoiceNotes;
  }
}, {});
const isCreateModalOpenReducer: Reducer<boolean> = handleActions({
  'mvj/invoiceNote/HIDE_CREATE_MODAL': () => false,
  'mvj/invoiceNote/SHOW_CREATE_MODAL': () => true
}, false);
export default combineReducers<Record<string, any>, any>({
  attributes: attributesReducer,
  isCreateModalOpen: isCreateModalOpenReducer,
  isFetching: isFetchingReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  list: listReducer,
  methods: methodsReducer
});