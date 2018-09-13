// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  FetchCollectionNotesByLeaseAction,
  ReceiveCollectionNotesByLeaseAction,
  CollectionNotesNotFoundByLeaseAction,
} from './types';

const isFetchingByLeaseReducer: Reducer<Object> = handleActions({
  ['mvj/collectionNote/FETCH_BY_LEASE']: (state: Object, {payload: lease}: FetchCollectionNotesByLeaseAction) => {
    return {
      ...state,
      [lease]: true,
    };
  },
  ['mvj/collectionNote/RECEIVE_BY_LEASE']: (state: Object, {payload: {lease}}: ReceiveCollectionNotesByLeaseAction) => {
    return {
      ...state,
      [lease]: false,
    };
  },
  ['mvj/collectionNote/NOT_FOUND_BY_LEASE']: (state: Object, {payload: lease}: CollectionNotesNotFoundByLeaseAction) => {
    return {
      ...state,
      [lease]: false,
    };
  },
}, {});

const byLeaseReducer: Reducer<Object> = handleActions({
  ['mvj/collectionNote/RECEIVE_BY_LEASE']: (state: Object, {payload}: ReceiveCollectionNotesByLeaseAction) => {
    return {
      ...state,
      [payload.lease]: payload.collectionNotes,
    };
  },
}, {});

export default combineReducers({
  byLease: byLeaseReducer,
  isFetchingByLease: isFetchingByLeaseReducer,
});
