// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  Attributes,
  CommentState,
  CommentListMap,
  ReceiveAttributesAction,
  ReceiveCommentsByLeaseAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/comments/CREATE': () => true,
  'mvj/comments/EDIT': () => true,
  'mvj/comments/FETCH_ALL': () => true,
  'mvj/comments/NOT_FOUND': () => false,
  'mvj/comments/RECEIVE_ALL': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/comments/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, {});

const byLeaseReducer: Reducer<CommentListMap> = handleActions({
  ['mvj/comments/RECEIVE_BY_LEASE']: (state: CommentState, {payload: list}: ReceiveCommentsByLeaseAction) => {
    return {
      ...state,
      [list.leaseId]: list.comments,
    };
  },
}, {});

export default combineReducers({
  attributes: attributesReducer,
  byLease: byLeaseReducer,
  isFetching: isFetchingReducer,
});
