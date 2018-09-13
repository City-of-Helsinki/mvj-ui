// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  FetchCollectionCourtDecisionsByLeaseAction,
  ReceiveCollectionCourtDecisionsByLeaseAction,
  CollectionCourtDecisionsNotFoundByLeaseAction,
} from './types';

const isFetchingByLeaseReducer: Reducer<Object> = handleActions({
  ['mvj/collectionCourtDecision/FETCH_BY_LEASE']: (state: Object, {payload: lease}: FetchCollectionCourtDecisionsByLeaseAction) => {
    return {
      ...state,
      [lease]: true,
    };
  },
  ['mvj/collectionCourtDecision/RECEIVE_BY_LEASE']: (state: Object, {payload: {lease}}: ReceiveCollectionCourtDecisionsByLeaseAction) => {
    return {
      ...state,
      [lease]: false,
    };
  },
  ['mvj/collectionCourtDecision/NOT_FOUND_BY_LEASE']: (state: Object, {payload: lease}: CollectionCourtDecisionsNotFoundByLeaseAction) => {
    return {
      ...state,
      [lease]: false,
    };
  },
}, {});

const byLeaseReducer: Reducer<Object> = handleActions({
  ['mvj/collectionCourtDecision/RECEIVE_BY_LEASE']: (state: Object, {payload}: ReceiveCollectionCourtDecisionsByLeaseAction) => {
    return {
      ...state,
      [payload.lease]: payload.collectionCourtDecisions,
    };
  },
}, {});

export default combineReducers({
  byLease: byLeaseReducer,
  isFetchingByLease: isFetchingByLeaseReducer,
});
