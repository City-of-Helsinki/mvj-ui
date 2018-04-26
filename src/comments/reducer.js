// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  Attributes,
  CommentList,
  ReceiveAttributesAction,
  ReceiveCommentsAction,
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

const commentsReducer: Reducer<CommentList> = handleActions({
  ['mvj/comments/RECEIVE_ALL']: (state: CommentList, {payload: comments}: ReceiveCommentsAction) => {
    return comments;
  },
}, []);

export default combineReducers({
  attributes: attributesReducer,
  isFetching: isFetchingReducer,
  list: commentsReducer,
});
