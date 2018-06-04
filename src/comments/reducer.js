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
  HideEditModeByIdAction,
  ShowEditModeByIdAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/comments/CREATE': () => true,
  'mvj/comments/EDIT': () => true,
  'mvj/comments/FETCH_BY_LEASE': () => true,
  'mvj/comments/NOT_FOUND': () => false,
  'mvj/comments/RECEIVE_BY_LEASE': () => false,
}, false);

const isEditModeByIdReducer: Reducer<CommentListMap> = handleActions({
  ['mvj/comments/HIDE_BY_ID']: (state: CommentState, {payload: id}: HideEditModeByIdAction) => {
    return {
      ...state,
      [id]: false,
    };
  },
  ['mvj/comments/SHOW_BY_ID']: (state: CommentState, {payload: id}: ShowEditModeByIdAction) => {
    return {
      ...state,
      [id]: true,
    };
  },
}, {});

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
  isEditModeById: isEditModeByIdReducer,
  isFetching: isFetchingReducer,
});
