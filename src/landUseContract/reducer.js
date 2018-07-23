// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import {FormNames} from './enums';

import type {Reducer} from '../types';
import type {
  Attributes,
  LandUseContractState,
  LandUseContract,
  LandUseContractList,
  ReceiveAttributesAction,
  ReceiveFormValidFlagsAction,
  ReceiveLandUseContractListAction,
  ReceiveSingleLandUseContractAction,
  ReceiveIsSaveClickedAction,
} from './types';

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/landUseContract/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, {});

const isEditModeReducer: Reducer<boolean> = handleActions({
  ['mvj/landUseContract/HIDE_EDIT']: () => false,
  ['mvj/landUseContract/SHOW_EDIT']: () => true,
}, false);

const isFetchingReducer: Reducer<boolean> = handleActions({
  ['mvj/landUseContract/FETCH_ALL']: () => true,
  ['mvj/landUseContract/RECEIVE_ALL']: () => false,
  ['mvj/landUseContract/FETCH_SINGLE']: () => true,
  ['mvj/landUseContract/RECEIVE_SINGLE']: () => false,
  ['mvj/landUseContract/EDIT']: () => true,
  ['mvj/landUseContract/NOT_FOUND']: () => false,
}, false);

const landUseContractListReducer: Reducer<LandUseContractList> = handleActions({
  ['mvj/landUseContract/RECEIVE_ALL']: (state: LandUseContractState, {payload: list}: ReceiveLandUseContractListAction) => list,
}, {});

const currentLandUseContractReducer: Reducer<LandUseContract> = handleActions({
  ['mvj/landUseContract/RECEIVE_SINGLE']: (state: LandUseContractState, {payload: contract}: ReceiveSingleLandUseContractAction) => contract,
}, {});

const isFormValidByIdReducer: Reducer<Object> = handleActions({
  ['mvj/landUseContract/RECEIVE_FORM_VALID_FLAGS']: (state: Object, {payload: valid}: ReceiveFormValidFlagsAction) => {
    return {
      ...state,
      ...valid,
    };
  },
  ['mvj/landUseContract/CLEAR_FORM_VALID_FLAGS']: () => {
    return {
      [FormNames.BASIC_INFORMATION]: true,
      [FormNames.COMPENSATIONS]: true,
      [FormNames.CONTRACTS]: true,
      [FormNames.DECISIONS]: true,
      [FormNames.INVOICES]: true,
    };
  },
}, {
  [FormNames.BASIC_INFORMATION]: true,
  [FormNames.COMPENSATIONS]: true,
  [FormNames.CONTRACTS]: true,
  [FormNames.DECISIONS]: true,
  [FormNames.INVOICES]: true,
});

const isSaveClickedReducer: Reducer<boolean> = handleActions({
  ['mvj/landUseContract/RECEIVE_SAVE_CLICKED']: (state: boolean, {payload: isClicked}: ReceiveIsSaveClickedAction) => {
    return isClicked;
  },
}, false);

export default combineReducers({
  attributes: attributesReducer,
  current: currentLandUseContractReducer,
  isEditMode: isEditModeReducer,
  isFetching: isFetchingReducer,
  isFormValidById: isFormValidByIdReducer,
  isSaveClicked: isSaveClickedReducer,
  list: landUseContractListReducer,
});
