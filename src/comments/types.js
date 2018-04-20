// @flow

import type {Action} from '../types';

import type {LeaseId} from '$src/leases/types';

export type CommentState = Object;

export type Attributes = Object;
export type Comment = Object;
export type CommentList = Array<Object>;
export type CommentId = number;

export type FetchAttributesAction = Action<'mvj/comments/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/comments/RECEIVE_ATTRIBUTES', Attributes>;
export type FetchCommentsAction = Action<'mvj/comments/FETCH_ALL', LeaseId>;
export type ReceiveCommentsAction = Action<'mvj/comments/RECEIVE_ALL', Array<Comment>>;
export type CreateCommentAction = Action<'mvj/comments/CREATE', Comment>;
export type EditCommentAction = Action<'mvj/comments/EDIT', Comment>;
export type CommentNotFoundAction = Action<'mvj/comments/NOT_FOUND', void>;
