import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Attributes, Methods, Reducer } from "@/types";
import type { ReceiveAttributesAction, ReceiveMethodsAction, RentBasis, RentBasisList, ReceiveRentBasisListAction, ReceiveRentBasisInitialValuesAction, ReceiveSingleRentBasisAction, ReceiveFormValidAction, ReceiveIsSaveClickedAction } from "./types";
const isEditModeReducer: Reducer<boolean> = handleActions({
  'mvj/rentbasis/HIDE_EDIT': () => false,
  'mvj/rentbasis/SHOW_EDIT': () => true
}, false);
const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/rentbasis/FETCH_ALL': () => true,
  'mvj/rentbasis/FETCH_SINGLE': () => true,
  'mvj/rentbasis/RECEIVE_ALL': () => false,
  'mvj/rentbasis/RECEIVE_SINGLE': () => false,
  'mvj/rentbasis/NOT_FOUND': () => false
}, false);
const isSavingReducer: Reducer<boolean> = handleActions({
  'mvj/rentbasis/CREATE': () => true,
  'mvj/rentbasis/EDIT': () => true,
  'mvj/rentbasis/RECEIVE_SINGLE': () => false,
  'mvj/rentbasis/NOT_FOUND': () => false
}, false);
const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/rentbasis/FETCH_ATTRIBUTES': () => true,
  'mvj/rentbasis/RECEIVE_METHODS': () => false,
  'mvj/rentbasis/ATTRIBUTES_NOT_FOUND': () => false
}, false);
const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/rentbasis/RECEIVE_ATTRIBUTES']: (state: Attributes, {
    payload: attributes
  }: ReceiveAttributesAction) => {
    return attributes;
  }
}, null);
const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/rentbasis/RECEIVE_METHODS']: (state: Methods, {
    payload: methods
  }: ReceiveMethodsAction) => {
    return methods;
  }
}, null);
const rentBasisListReducer: Reducer<RentBasisList> = handleActions({
  ['mvj/rentbasis/RECEIVE_ALL']: (state: RentBasisList, {
    payload: rentbasis
  }: ReceiveRentBasisListAction) => {
    return rentbasis;
  }
}, {});
const rentBasisReducer: Reducer<RentBasis> = handleActions({
  ['mvj/rentbasis/RECEIVE_SINGLE']: (state: RentBasis, {
    payload: rentbasis
  }: ReceiveSingleRentBasisAction) => {
    return rentbasis;
  }
}, {});
const initialValuesReducer: Reducer<RentBasis> = handleActions({
  ['mvj/rentbasis/INITIALIZE']: (state: RentBasis, {
    payload: rentbasis
  }: ReceiveRentBasisInitialValuesAction) => {
    return rentbasis;
  }
}, {
  decisions: [{}],
  property_identifiers: [{}],
  rent_rates: [{}]
});
const isFormValidReducer: Reducer<boolean> = handleActions({
  ['mvj/rentbasis/RECEIVE_FORM_VALID']: (state: boolean, {
    payload: valid
  }: ReceiveFormValidAction) => {
    return valid;
  }
}, false);
const isSaveClickedReducer: Reducer<boolean> = handleActions({
  ['mvj/rentbasis/RECEIVE_SAVE_CLICKED']: (state: boolean, {
    payload: isClicked
  }: ReceiveIsSaveClickedAction) => {
    return isClicked;
  }
}, false);
export default combineReducers<Record<string, any>, any>({
  attributes: attributesReducer,
  initialValues: initialValuesReducer,
  isEditMode: isEditModeReducer,
  isFormValid: isFormValidReducer,
  isFetching: isFetchingReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  isSaveClicked: isSaveClickedReducer,
  isSaving: isSavingReducer,
  list: rentBasisListReducer,
  methods: methodsReducer,
  rentbasis: rentBasisReducer
});