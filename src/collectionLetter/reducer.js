// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  FetchCollectionLettersByLeaseAction,
  ReceiveCollectionLettersByLeaseAction,
  CollectionLettersNotFoundByLeaseAction,
} from './types';

const isFetchingByLeaseReducer: Reducer<Object> = handleActions({
  ['mvj/collectionLetter/FETCH_BY_LEASE']: (state: Object, {payload: lease}: FetchCollectionLettersByLeaseAction) => {
    return {
      ...state,
      [lease]: true,
    };
  },
  ['mvj/collectionLetter/RECEIVE_BY_LEASE']: (state: Object, {payload: {lease}}: ReceiveCollectionLettersByLeaseAction) => {
    return {
      ...state,
      [lease]: false,
    };
  },
  ['mvj/collectionLetter/NOT_FOUND_BY_LEASE']: (state: Object, {payload: lease}: CollectionLettersNotFoundByLeaseAction) => {
    return {
      ...state,
      [lease]: false,
    };
  },
}, {});

const byLeaseReducer: Reducer<Object> = handleActions({
  ['mvj/collectionLetter/RECEIVE_BY_LEASE']: (state: Object, {payload}: ReceiveCollectionLettersByLeaseAction) => {
    return {
      ...state,
      [payload.lease]: payload.collectionLetters,
    };
  },
}, {});

export default combineReducers({
  byLease: byLeaseReducer,
  isFetchingByLease: isFetchingByLeaseReducer,
});
