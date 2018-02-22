// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';

import type {
  RentCriteriasList,
  ReceiveRentCriteriasAction,
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

export default combineReducers({
  isFetching: isFetchingReducer,
  list: rentCriteriasListReducer,
});
