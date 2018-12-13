// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  DecisionListMap,
  ReceiveDecisionsByLeaseAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/decision/FETCH_BY_LEASE': () => true,
  'mvj/decision/NOT_FOUND': () => false,
  'mvj/decision/RECEIVE_BY_LEASE': () => false,
}, false);


const byLeaseReducer: Reducer<DecisionListMap> = handleActions({
  ['mvj/decision/RECEIVE_BY_LEASE']: (state: DecisionListMap, {payload: list}: ReceiveDecisionsByLeaseAction) => {
    return {
      ...state,
      [list.leaseId]: list.decisions,
    };
  },
}, {});

export default combineReducers({
  byLease: byLeaseReducer,
  isFetching: isFetchingReducer,
});
