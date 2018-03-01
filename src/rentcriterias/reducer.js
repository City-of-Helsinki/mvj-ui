// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';

import type {
  RentCriteria,
  RentCriteriasList,
  ReceiveRentCriteriasAction,
  ReceiveRentCriteriaInitialValuesAction,
  ReceiveSingleRentCriteriaAction,
} from './types';

const isEditModeReducer: Reducer<boolean> = handleActions({
  'mvj/rentcriterias/HIDE_EDIT': () => false,
  'mvj/rentcriterias/SHOW_EDIT': () => true,
}, false);

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/rentcriterias/EDIT': () => true,
  'mvj/rentcriterias/FETCH_ALL': () => true,
  'mvj/rentcriterias/FETCH_SINGLE': () => true,
  'mvj/rentcriterias/RECEIVE_ALL': () => false,
  'mvj/rentcriterias/RECEIVE_SINGLE': () => false,
}, false);

const rentCriteriasListReducer: Reducer<RentCriteriasList> = handleActions({
  ['mvj/rentcriterias/RECEIVE_ALL']: (state: RentCriteriasList, {payload: rentcriterias}: ReceiveRentCriteriasAction) => {
    return rentcriterias;
  },
}, []);

const rentCriteriaReducer: Reducer<RentCriteria> = handleActions({
  ['mvj/rentcriterias/RECEIVE_SINGLE']: (state: RentCriteria, {payload: rentcriteria}: ReceiveSingleRentCriteriaAction) => {
    return rentcriteria;
  },
}, {});

const initialValuesReducer: Reducer<RentCriteria> = handleActions({
  ['mvj/rentcriterias/INITIALIZE']: (state: RentCriteria, {payload: rentcriteria}: ReceiveRentCriteriaInitialValuesAction) => {
    return rentcriteria;
  },
}, {
  decisions: [''],
  prices: [{}],
  real_estate_ids: [''],
});

export default combineReducers({
  criteria: rentCriteriaReducer,
  initialValues: initialValuesReducer,
  isEditMode: isEditModeReducer,
  isFetching: isFetchingReducer,
  list: rentCriteriasListReducer,
});
