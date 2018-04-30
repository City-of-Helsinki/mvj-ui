// @flow

import type {Selector} from '../types';

import type {
  Attributes,
  CommentList,
  CommentState,
} from './types';
import type {LeaseId} from '$src/leases/types';

export const getIsFetching: Selector<boolean, void> = (state: CommentState): boolean =>
  state.comment.isFetching;

export const getAttributes: Selector<Attributes, void> = (state: CommentState): Attributes =>
  state.comment.attributes;

export const getCommentsByLease: Selector<CommentList, LeaseId> = (state: CommentState, leaseId: LeaseId): CommentList =>
  state.comment.byLease[leaseId];
