// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import merge from 'lodash/merge';

import {FormNames} from '$src/enums';

import type {Attributes, Reducer} from '$src/types';
import type {
  LandUseContract,
  LandUseContractList,
  ReceiveAttributesAction,
  ReceiveFormValidFlagsAction,
  ReceiveLandUseContractListAction,
  ReceiveSingleLandUseContractAction,
  ReceiveIsSaveClickedAction,
  ReceiveCollapseStatesAction,
} from './types';

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/landUseContract/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, null);

const isEditModeReducer: Reducer<boolean> = handleActions({
  ['mvj/landUseContract/HIDE_EDIT']: () => false,
  ['mvj/landUseContract/SHOW_EDIT']: () => true,
}, false);

const isFetchingReducer: Reducer<boolean> = handleActions({
  ['mvj/landUseContract/FETCH_ALL']: () => true,
  ['mvj/landUseContract/RECEIVE_ALL']: () => false,
  ['mvj/landUseContract/FETCH_SINGLE']: () => true,
  ['mvj/landUseContract/RECEIVE_SINGLE']: () => false,
  ['mvj/landUseContract/CREATE']: () => true,
  ['mvj/landUseContract/EDIT']: () => true,
  ['mvj/landUseContract/NOT_FOUND']: () => false,
}, false);

const landUseContractListReducer: Reducer<LandUseContractList> = handleActions({
  ['mvj/landUseContract/RECEIVE_ALL']: (state: LandUseContractList, {payload: list}: ReceiveLandUseContractListAction) => list,
}, {});

const currentLandUseContractReducer: Reducer<LandUseContract> = handleActions({
  ['mvj/landUseContract/RECEIVE_SINGLE']: (state: LandUseContract, {payload: contract}: ReceiveSingleLandUseContractAction) => contract,
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
      [FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION]: true,
      [FormNames.LAND_USE_CONTRACT_COMPENSATIONS]: true,
      [FormNames.LAND_USE_CONTRACT_CONTRACTS]: true,
      [FormNames.LAND_USE_CONTRACT_DECISIONS]: true,
      [FormNames.LAND_USE_CONTRACT_INVOICES]: true,
      [FormNames.LAND_USE_CONTRACT_LITIGANTS]: true,
    };
  },
}, {
  [FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION]: true,
  [FormNames.LAND_USE_CONTRACT_COMPENSATIONS]: true,
  [FormNames.LAND_USE_CONTRACT_CONTRACTS]: true,
  [FormNames.LAND_USE_CONTRACT_DECISIONS]: true,
  [FormNames.LAND_USE_CONTRACT_INVOICES]: true,
  [FormNames.LAND_USE_CONTRACT_LITIGANTS]: true,
});

const isSaveClickedReducer: Reducer<boolean> = handleActions({
  ['mvj/landUseContract/RECEIVE_SAVE_CLICKED']: (state: boolean, {payload: isClicked}: ReceiveIsSaveClickedAction) => {
    return isClicked;
  },
}, false);

const collapseStatesReducer: Reducer<Object> = handleActions({
  ['mvj/landUseContract/RECEIVE_COLLAPSE_STATES']: (state: Object, {payload: states}: ReceiveCollapseStatesAction) => {
    return merge(state, states);
  },
}, {});

export default combineReducers<Object, any>({
  attributes: attributesReducer,
  collapseStates: collapseStatesReducer,
  current: currentLandUseContractReducer,
  isEditMode: isEditModeReducer,
  isFetching: isFetchingReducer,
  isFormValidById: isFormValidByIdReducer,
  isSaveClicked: isSaveClickedReducer,
  list: landUseContractListReducer,
});
