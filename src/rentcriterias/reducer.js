// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';

import type {
  RentCriteria,
  RentCriteriasList,
  ReceiveRentCriteriasAction,
  ReceiveRentCriteriaInitialValuesAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/rentcriterias/FETCH_ALL': () => true,
  'mvj/rentcriterias/RECEIVE_ALL': () => false,
}, false);

const rentCriteriasListReducer: Reducer<RentCriteriasList> = handleActions({
  ['mvj/rentcriterias/RECEIVE_ALL']: (state: RentCriteriasList, {payload: rentcriterias}: ReceiveRentCriteriasAction) => {
    return rentcriterias;
  },
}, []);

const rentCriteriaReducer: Reducer<RentCriteria> = handleActions({
  ['mvj/rentcriterias/INITIALIZE']: (state: RentCriteria, {payload: rentcriteria}: ReceiveRentCriteriaInitialValuesAction) => {
    return rentcriteria;
  },
}, {
  decisions: [''],
  prices: [{}],
  real_estate_ids: [''],
});

export default combineReducers({
  isFetching: isFetchingReducer,
  list: rentCriteriasListReducer,
  initialValues: rentCriteriaReducer,
});
