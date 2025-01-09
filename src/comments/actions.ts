import { createAction } from "redux-actions";
import type { Attributes, Methods } from "types";
import type { LeaseId } from "@/leases/types";
import type {
  Comment,
  CommentId,
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  FetchCommentsByLeaseAction,
  CreateCommentAction,
  EditCommentAction,
  ReceiveCommentsByLeaseAction,
  CommentAttributesNotFoundAction,
  CommentNotFoundAction,
  ClearEditFlagsAction,
  HideEditModeByIdAction,
  ShowEditModeByIdAction,
  ReceiveIsSaveClickedAction,
} from "./types";
export const attributesNotFound = (): CommentAttributesNotFoundAction =>
  createAction("mvj/comments/ATTRIBUTES_NOT_FOUND")();
export const notFound = (): CommentNotFoundAction =>
  createAction("mvj/comments/NOT_FOUND")();
export const fetchAttributes = (): FetchAttributesAction =>
  createAction("mvj/comments/FETCH_ATTRIBUTES")();
export const receiveAttributes = (
  attributes: Attributes,
): ReceiveAttributesAction =>
  createAction("mvj/comments/RECEIVE_ATTRIBUTES")(attributes);
export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction("mvj/comments/RECEIVE_METHODS")(methods);
export const fetchCommentsByLease = (
  leaseId: LeaseId,
): FetchCommentsByLeaseAction =>
  createAction("mvj/comments/FETCH_BY_LEASE")(leaseId);
export const receiveCommentsByLease = (
  comments: Comment,
): ReceiveCommentsByLeaseAction =>
  createAction("mvj/comments/RECEIVE_BY_LEASE")(comments);
export const createComment = (comment: Comment): CreateCommentAction =>
  createAction("mvj/comments/CREATE")(comment);
export const editComment = (comment: Comment): EditCommentAction =>
  createAction("mvj/comments/EDIT")(comment);
export const clearEditFlags = (): ClearEditFlagsAction =>
  createAction("mvj/comments/CLEAR_EDIT_FLAGS")();
export const hideEditModeById = (id: CommentId): HideEditModeByIdAction =>
  createAction("mvj/comments/HIDE_BY_ID")(id);
export const showEditModeById = (id: CommentId): ShowEditModeByIdAction =>
  createAction("mvj/comments/SHOW_BY_ID")(id);
export const receiveIsSaveClicked = (
  isClicked: boolean,
): ReceiveIsSaveClickedAction =>
  createAction("mvj/comments/RECEIVE_SAVE_CLICKED")(isClicked);
