// @flow

import {createAction} from 'redux-actions';

import type {
  Attributes,
  FetchAttributesAction,
  ReceiveAttributesAction,
  Lessors,
  FetchLessorsAction,
  ReceiveLessorsAction,
  Decisions,
  FetchDecisionsAction,
  ReceiveDecisionsAction,
  Lease,
  LeaseId,
  LeaseNotFoundAction,
  LeasesList,
  CreateLeaseAction,
  EditLeaseAction,
  PatchLeaseAction,
  FetchLeasesAction,
  FetchSingleLeaseAction,
  ReceiveLeasesAction,
  ReceiveSingleLeaseAction,
  Comment,
  FetchCommentsAction,
  ReceiveCommentsAction,
  FetchCommentAttributesAction,
  ReceiveCommentAttributesAction,
  CreateCommentAction,
  ReceiveCreatedCommentAction,
  EditCommentAction,
  ReceiveEditedCommentAction,
  HideEditModeAction,
  ShowEditModeAction,
  ClearFormValidityFlagsAction,
  ReceiveConstructabilityFormValidAction,
  ReceiveContractsFormValidAction,
  ReceiveDecisionsFormValidAction,
  ReceiveInspectionsFormValidAction,
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

export const fetchDecisions = (search: string): FetchDecisionsAction =>
  createAction('mvj/leases/FETCH_DECISIONS')(search);

export const receiveDecisions = (decisions: Decisions): ReceiveDecisionsAction =>
  createAction('mvj/leases/RECEIVE_DECISIONS')(decisions);

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

export const receiveCreatedComment = (comment: Comment): ReceiveCreatedCommentAction =>
  createAction('mvj/leases/RECEIVE_CREATED_COMMENT')(comment);

export const editComment = (comment: Comment): EditCommentAction =>
  createAction('mvj/leases/EDIT_COMMENT')(comment);

export const receiveEditedComment = (comment: Comment): ReceiveEditedCommentAction =>
  createAction('mvj/leases/RECEIVE_EDITED_COMMENT')(comment);

// Actions to manage form validity statuses
export const clearFormValidFlags = (): ClearFormValidityFlagsAction =>
  createAction('mvj/leases/CLEAR_FORM_VALIDITY_FLAGS')();

export const receiveConstructabilityFormValid = (valid: boolean): ReceiveConstructabilityFormValidAction =>
  createAction('mvj/leases/RECEIVE_CONSTRUCTABILITY_FORM_VALID')(valid);

export const receiveContractsFormValid = (valid: boolean): ReceiveContractsFormValidAction =>
  createAction('mvj/leases/RECEIVE_CONTRACTS_FORM_VALID')(valid);

export const receiveDecisionsFormValid = (valid: boolean): ReceiveDecisionsFormValidAction =>
  createAction('mvj/leases/RECEIVE_DECISIONS_FORM_VALID')(valid);

export const receiveInspectionsFormValid = (valid: boolean): ReceiveInspectionsFormValidAction =>
  createAction('mvj/leases/RECEIVE_INSPECTIONS_FORM_VALID')(valid);

export const receiveLeaseAreasFormValid = (valid: boolean): ReceiveLeaseAreasFormValidAction =>
  createAction('mvj/leases/RECEIVE_LEASE_AREAS_FORM_VALID')(valid);

export const receiveLeaseInfoFormValid = (valid: boolean): ReceiveLeaseInfoFormValidAction =>
  createAction('mvj/leases/RECEIVE_LEASE_INFO_FORM_VALID')(valid);

export const receiveSummaryFormValid = (valid: boolean): ReceiveSummaryFormValidAction =>
  createAction('mvj/leases/RECEIVE_SUMMARY_FORM_VALID')(valid);
