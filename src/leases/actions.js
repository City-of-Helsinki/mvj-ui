// @flow

import {createAction} from 'redux-actions';

import type {
  Areas,
  FetchAttributesAction,
  FetchLessorsAction,
  FetchInvoicesAction,
  FetchAreasAction,
  Attributes,
  ReceiveAttributesAction,
  ReceiveLessorsAction,
  ReceiveInvoicesAction,
  ReceiveAreasAction,
  Lease,
  Invoices,
  LeaseId,
  LeaseNotFoundAction,
  LeasesList,
  Lessors,
  CreateLeaseAction,
  EditLeaseAction,
  PatchLeaseAction,
  FetchLeasesAction,
  FetchSingleLeaseAction,
  ReceiveLeasesAction,
  ReceiveSingleLeaseAction,
  HideEditModeAction,
  ShowEditModeAction,
  Comment,
  FetchCommentsAction,
  ReceiveCommentsAction,
  FetchCommentAttributesAction,
  ReceiveCommentAttributesAction,
  CreateCommentAction,
  DeleteCommentAction,
  EditCommentAction,
  ArchiveCommentAction,
  UnarchiveCommentAction,
  ReceiveSingleCommentAction,
  ReceiveDeletedCommentAction,
  ReceiveEditedCommentAction,
  ClearFormValidityFlagsAction,
  ReceiveLeaseInfoFormValidAction,
  ReceiveSummaryFormValidAction,
  ReceiveLeaseAreasFormValidAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/leases/FETCH_ATTRIBUTES')();

export const receiveAttributes = (identifiers: Attributes): ReceiveAttributesAction =>
  createAction('mvj/leases/RECEIVE_ATTRIBUTES')(identifiers);

export const fetchLessors = (): FetchLessorsAction =>
  createAction('mvj/leases/FETCH_LESSORS')();

export const receiveLessors = (lessors: Lessors): ReceiveLessorsAction =>
  createAction('mvj/leases/RECEIVE_LESSORS')(lessors);

export const fetchInvoices = (lease: LeaseId): FetchInvoicesAction =>
  createAction('mvj/leases/FETCH_INVOICES')(lease);

export const receiveInvoices = (invoices: Invoices): ReceiveInvoicesAction =>
  createAction('mvj/leases/RECEIVE_INVOICES')(invoices);

export const fetchAreas = (): FetchAreasAction =>
  createAction('mvj/leases/FETCH_AREAS')();

export const receiveAreas = (areas: Areas): ReceiveAreasAction =>
  createAction('mvj/leases/RECEIVE_AREAS')(areas);

export const fetchLeases = (search: string): FetchLeasesAction =>
  createAction('mvj/leases/FETCH_ALL')(search);

export const receiveLeases = (leases: LeasesList): ReceiveLeasesAction =>
  createAction('mvj/leases/RECEIVE_ALL')(leases);

export const fetchSingleLease = (id: LeaseId): FetchSingleLeaseAction =>
  createAction('mvj/leases/FETCH_SINGLE')(id);

export const receiveSingleLease = (lease: Lease): ReceiveSingleLeaseAction =>
  createAction('mvj/leases/RECEIVE_SINGLE')(lease);

export const createLease = (lease: Lease): CreateLeaseAction =>
  createAction('mvj/leases/CREATE')(lease);

export const editLease = (lease: Lease): EditLeaseAction =>
  createAction('mvj/leases/EDIT')(lease);

export const patchLease = (lease: Lease): PatchLeaseAction =>
  createAction('mvj/leases/PATCH')(lease);

export const notFound = (): LeaseNotFoundAction =>
  createAction('mvj/leases/NOT_FOUND')();

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/leases/HIDE_EDIT')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/leases/SHOW_EDIT')();

export const fetchComments = (leaseId: LeaseId): FetchCommentsAction =>
  createAction('mvj/leases/FETCH_COMMENTS')(leaseId);

export const receiveComments = (comments: Array<Comment>): ReceiveCommentsAction =>
  createAction('mvj/leases/RECEIVE_COMMENTS')(comments);

export const fetchCommentAttributes = (): FetchCommentAttributesAction =>
  createAction('mvj/leases/FETCH_COMMENT_ATTRIBUTES')();

export const receiveCommentAttributes = (identifiers: Attributes): ReceiveCommentAttributesAction =>
  createAction('mvj/leases/RECEIVE_COMMENT_ATTRIBUTES')(identifiers);

export const createComment = (comment: Comment): CreateCommentAction =>
  createAction('mvj/leases/CREATE_COMMENT')(comment);

export const deleteComment = (comment: Comment): DeleteCommentAction =>
  createAction('mvj/leases/DELETE_COMMENT')(comment);

export const editComment = (comment: Comment): EditCommentAction =>
  createAction('mvj/leases/EDIT_COMMENT')(comment);

export const archiveComment = (comment: Comment): ArchiveCommentAction =>
  createAction('mvj/leases/ARCHIVE_COMMENT')(comment);

export const unarchiveComment = (comment: Comment): UnarchiveCommentAction =>
  createAction('mvj/leases/UNARCHIVE_COMMENT')(comment);

export const receiveComment = (comment: Comment): ReceiveSingleCommentAction =>
  createAction('mvj/leases/RECEIVE_SINGLE_COMMENT')(comment);

export const receiveDeletedComment = (comment: Comment): ReceiveDeletedCommentAction =>
  createAction('mvj/leases/RECEIVE_DELETED_COMMENT')(comment);

export const receiveEditedComment = (comment: Comment): ReceiveEditedCommentAction =>
  createAction('mvj/leases/RECEIVE_EDITED_COMMENT')(comment);

// Actions to manage form validity statuses
export const clearFormValidFlags = (): ClearFormValidityFlagsAction =>
  createAction('mvj/leases/CLEAR_FORM_VALIDITY_FLAGS')();

export const receiveLeaseAreasFormValid = (valid: boolean): ReceiveLeaseAreasFormValidAction =>
  createAction('mvj/leases/RECEIVE_LEASE_AREAS_VALID')(valid);

export const receiveLeaseInfoFormValid = (valid: boolean): ReceiveLeaseInfoFormValidAction =>
  createAction('mvj/leases/RECEIVE_LEASE_INFO_VALID')(valid);

export const receiveSummaryFormValid = (valid: boolean): ReceiveSummaryFormValidAction =>
  createAction('mvj/leases/RECEIVE_SUMMARY_VALID')(valid);
