// @flow
import type {Attributes, Selector} from '$src/types';
import type {RootState} from '$src/root/types';
import type {CommentId, CommentList} from './types';
import type {LeaseId} from '$src/leases/types';

export const getEditModeFlags: Selector<Object, void> = (state: RootState): Object =>
  state.comment.isEditModeById;

export const getIsEditModeById: Selector<boolean, CommentId> = (state: RootState, commentId: CommentId): boolean =>
  state.comment.isEditModeById[commentId];

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.comment.isFetching;

export const getIsSaveClicked: Selector<boolean, void> = (state: RootState): boolean =>
  state.comment.isSaveClicked;

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.comment.attributes;

export const getCommentsByLease: Selector<CommentList, LeaseId> = (state: RootState, leaseId: LeaseId): CommentList =>
  state.comment.byLease[leaseId];
