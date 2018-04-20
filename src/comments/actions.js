// @flow

import {createAction} from 'redux-actions';

import type {LeaseId} from '$src/leases/types';

import type {
  Attributes,
  Comment,
  FetchAttributesAction,
  ReceiveAttributesAction,
  FetchCommentsAction,
  CreateCommentAction,
  EditCommentAction,
  ReceiveCommentsAction,
  CommentNotFoundAction,
} from './types';

export const notFound = (): CommentNotFoundAction =>
  createAction('mvj/comments/NOT_FOUND')();

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/comments/FETCH_ATTRIBUTES')();

export const receiveAttributes = (identifiers: Attributes): ReceiveAttributesAction =>
  createAction('mvj/comments/RECEIVE_ATTRIBUTES')(identifiers);

export const fetchComments = (leaseId: LeaseId): FetchCommentsAction =>
  createAction('mvj/comments/FETCH_ALL')(leaseId);

export const receiveComments = (comments: Array<Comment>): ReceiveCommentsAction =>
  createAction('mvj/comments/RECEIVE_ALL')(comments);

export const createComment = (comment: Comment): CreateCommentAction =>
  createAction('mvj/comments/CREATE')(comment);

export const editComment = (comment: Comment): EditCommentAction =>
  createAction('mvj/comments/EDIT')(comment);
