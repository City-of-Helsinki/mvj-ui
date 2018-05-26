// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  RentForPeriod,
  ReceiveRentForPeriodAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/rentforperiod/FETCH_ALL': () => true,
  'mvj/rentforperiod/RECEIVE_ALL': () => false,
  'mvj/rentforperiod/NOT_FOUND': () => false,
}, false);

const byLeaseReducer: Reducer<RentForPeriod> = handleActions({
  ['mvj/rentforperiod/RECEIVE_ALL']: (state: RentForPeriod, {payload}: ReceiveRentForPeriodAction) => {
    return {
      ...state,
      [payload.leaseId]: payload.rent,
    };
  },
}, {});

export default combineReducers({
  byLease: byLeaseReducer,
  isFetching: isFetchingReducer,
});
