// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {ReceiveBillingPeriodsAction} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/billingperiods/FETCH_ALL': () => true,
  'mvj/billingperiods/RECEIVE_ALL': () => false,
  'mvj/billingperiods/NOT_FOUND': () => false,
}, false);

const byLeaseReducer: Reducer<Object> = handleActions({
  ['mvj/billingperiods/RECEIVE_ALL']: (state: Object, {payload}: ReceiveBillingPeriodsAction) => {
    return {
      ...state,
      [payload.leaseId]: payload.billingPeriods,
    };
  },
}, {});

export default combineReducers({
  byLease: byLeaseReducer,
  isFetching: isFetchingReducer,
});
