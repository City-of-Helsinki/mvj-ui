// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';

import type {
  Attributes,
  ReceiveAttributesAction,
  RentBasis,
  RentBasisList,
  ReceiveRentBasisListAction,
  ReceiveRentCriteriaInitialValuesAction,
  ReceiveSingleRentCriteriaAction,
} from './types';

const isEditModeReducer: Reducer<boolean> = handleActions({
  'mvj/rentbasis/HIDE_EDIT': () => false,
  'mvj/rentbasis/SHOW_EDIT': () => true,
}, false);

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/rentbasis/CREATE': () => true,
  'mvj/rentbasis/EDIT': () => true,
  'mvj/rentbasis/FETCH_ALL': () => true,
  'mvj/rentbasis/FETCH_SINGLE': () => true,
  'mvj/rentbasis/RECEIVE_ALL': () => false,
  'mvj/rentbasis/RECEIVE_SINGLE': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/rentbasis/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, {});

const rentBasisListReducer: Reducer<RentBasisList> = handleActions({
  ['mvj/rentbasis/RECEIVE_ALL']: (state: RentBasisList, {payload: rentbasis}: ReceiveRentBasisListAction) => {
    return rentbasis;
  },
}, {});

const rentCriteriaReducer: Reducer<RentBasis> = handleActions({
  ['mvj/rentbasisRECEIVE_SINGLE']: (state: RentBasis, {payload: rentbasis}: ReceiveSingleRentCriteriaAction) => {
    return rentbasis;
  },
}, {});

const initialValuesReducer: Reducer<RentBasis> = handleActions({
  ['mvj/rentbasis/INITIALIZE']: (state: RentBasis, {payload: rentbasis}: ReceiveRentCriteriaInitialValuesAction) => {
    return rentbasis;
  },
}, {
  decisions: [''],
  prices: [{}],
  real_estate_ids: [''],
});

export default combineReducers({
  attributes: attributesReducer,
  rentbasis: rentCriteriaReducer,
  initialValues: initialValuesReducer,
  isEditMode: isEditModeReducer,
  isFetching: isFetchingReducer,
  list: rentBasisListReducer,
});
