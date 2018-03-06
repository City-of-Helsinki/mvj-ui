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
  'mvj/rentcriteria/HIDE_EDIT': () => false,
  'mvj/rentcriteria/SHOW_EDIT': () => true,
}, false);

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/rentcriteria/EDIT': () => true,
  'mvj/rentcriteria/FETCH_ALL': () => true,
  'mvj/rentcriteria/FETCH_SINGLE': () => true,
  'mvj/rentcriteria/RECEIVE_ALL': () => false,
  'mvj/rentcriteria/RECEIVE_SINGLE': () => false,
}, false);

const rentCriteriasListReducer: Reducer<RentCriteriasList> = handleActions({
  ['mvj/rentcriteria/RECEIVE_ALL']: (state: RentCriteriasList, {payload: rentcriterias}: ReceiveRentCriteriasAction) => {
    return rentcriterias;
  },
}, []);

const rentCriteriaReducer: Reducer<RentCriteria> = handleActions({
  ['mvj/rentcriteria/RECEIVE_SINGLE']: (state: RentCriteria, {payload: rentcriteria}: ReceiveSingleRentCriteriaAction) => {
    return rentcriteria;
  },
}, {});

const initialValuesReducer: Reducer<RentCriteria> = handleActions({
  ['mvj/rentcriteria/INITIALIZE']: (state: RentCriteria, {payload: rentcriteria}: ReceiveRentCriteriaInitialValuesAction) => {
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
