// @flow

import type {Selector} from '../types';

import type {
  Attributes,
  CommentList,
  CommentState,
} from './types';

export const getIsFetching: Selector<boolean, void> = (state: CommentState): boolean =>
  state.comment.isFetching;

export const getAttributes: Selector<Attributes, void> = (state: CommentState): Attributes =>
  state.comment.attributes;

export const getComments: Selector<CommentList, void> = (state: CommentState): CommentList =>
  state.comment.list;
