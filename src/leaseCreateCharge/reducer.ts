import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Attributes, Reducer } from "types";
import type { ReceiveAttributesAction, ReceiveReceivableTypesAction } from "leaseCreateCharge/types";
const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/leaseCreateCharge/FETCH_ATTRIBUTES': () => true,
  'mvj/leaseCreateCharge/RECEIVE_ATTRIBUTES': () => false,
  'mvj/leaseCreateCharge/ATTRIBUTES_NOT_FOUND': () => false
}, false);
const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/leaseCreateCharge/RECEIVE_ATTRIBUTES']: (state: Attributes, {
    payload: attributes
  }: ReceiveAttributesAction) => {
    return attributes;
  }
}, null);
const isFetchingReceivableTypesReducer: Reducer<boolean> = handleActions({
  'mvj/leaseCreateCharge/FETCH_RECEIVABLE_TYPES': () => true,
  'mvj/leaseCreateCharge/RECEIVE_RECEIVABLE_TYPES': () => false,
  'mvj/leaseCreateCharge/RECEIVABLE_TYPES_NOT_FOUND': () => false
}, false);
const ReceivableTypesReducer: Reducer<Record<string, any>> = handleActions({
  ['mvj/leaseCreateCharge/RECEIVE_RECEIVABLE_TYPES']: (state: Record<string, any>, {
    payload: receivableTypes
  }: ReceiveReceivableTypesAction) => {
    return receivableTypes;
  }
}, null);
export default combineReducers<Record<string, any>, any>({
  attributes: attributesReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  receivableTypes: ReceivableTypesReducer,
  isFetchingReceivableTypes: isFetchingReceivableTypesReducer
});