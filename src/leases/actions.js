// @flow

import {createAction} from 'redux-actions';

import type {Contact} from '$src/contacts/types';
import type {
  Attributes,
  FetchAttributesAction,
  ReceiveAttributesAction,
  Lease,
  LeaseId,
  LeaseNotFoundAction,
  LeaseList,
  CreateLeaseAction,
  PatchLeaseAction,
  FetchLeasesAction,
  FetchSingleLeaseAction,
  ReceiveLeasesAction,
  ReceiveSingleLeaseAction,
  StartInvoicingAction,
  StopInvoicingAction,
} from './types';
import type {
  HideContactModalAction,
  ShowContactModalAction,
  ContactModalSettings,
  ReceiveContactModalSettingsAction,
  CreateContactAction,
  EditContactAction,
} from './types';
import type {
  DecisionList,
  FetchDecisionsAction,
  ReceiveDecisionsAction,
} from './types';
import type {
  DistrictList,
  FetchDistrictsAction,
  ReceiveDistrictsAction,
} from './types';
import type {
  LessorList,
  FetchLessorsAction,
  ReceiveLessorsAction,
} from './types';
import type {
  Comment,
  FetchCommentAttributesAction,
  ReceiveCommentAttributesAction,
  FetchCommentsAction,
  CreateCommentAction,
  EditCommentAction,
  ReceiveCommentsAction,
  ReceiveCreatedCommentAction,
  ReceiveEditedCommentAction,
} from './types';

import type {
  HideEditModeAction,
  ShowEditModeAction,
  ClearFormValidityFlagsAction,
  ReceiveConstructabilityFormValidAction,
  ReceiveContractsFormValidAction,
  ReceiveDecisionsFormValidAction,
  ReceiveInspectionsFormValidAction,
  ReceiveLeaseAreasFormValidAction,
  ReceiveLeaseInfoFormValidAction,
  ReceiveRentsFormValidAction,
  ReceiveSummaryFormValidAction,
  ReceiveTenantsFormValidAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/leases/FETCH_ATTRIBUTES')();

export const receiveAttributes = (identifiers: Attributes): ReceiveAttributesAction =>
  createAction('mvj/leases/RECEIVE_ATTRIBUTES')(identifiers);

export const fetchLeases = (search: string): FetchLeasesAction =>
  createAction('mvj/leases/FETCH_ALL')(search);

export const receiveLeases = (leases: LeaseList): ReceiveLeasesAction =>
  createAction('mvj/leases/RECEIVE_ALL')(leases);

export const fetchSingleLease = (id: LeaseId): FetchSingleLeaseAction =>
  createAction('mvj/leases/FETCH_SINGLE')(id);

export const receiveSingleLease = (lease: Lease): ReceiveSingleLeaseAction =>
  createAction('mvj/leases/RECEIVE_SINGLE')(lease);

export const createLease = (lease: Lease): CreateLeaseAction =>
  createAction('mvj/leases/CREATE')(lease);

export const patchLease = (lease: Lease): PatchLeaseAction =>
  createAction('mvj/leases/PATCH')(lease);

export const startInvoicing = (id: LeaseId): StartInvoicingAction =>
  createAction('mvj/leases/START_INVOICING')(id);

export const stopInvoicing = (id: LeaseId): StopInvoicingAction =>
  createAction('mvj/leases/STOP_INVOICING')(id);

export const notFound = (): LeaseNotFoundAction =>
  createAction('mvj/leases/NOT_FOUND')();

export const hideContactModal = (): HideContactModalAction =>
  createAction('mvj/leases/HIDE_CONTACT_MODAL')();

export const showContactModal = (): ShowContactModalAction =>
  createAction('mvj/leases/SHOW_CONTACT_MODAL')();

export const receiveContactModalSettings = (settings: ContactModalSettings): ReceiveContactModalSettingsAction =>
  createAction('mvj/leases/RECEIVE_CONTACT_SETTINGS')(settings);

export const createContact = (contact: Contact): CreateContactAction =>
  createAction('mvj/leases/CREATE_CONTACT')(contact);

export const editContact = (contact: Contact): EditContactAction =>
  createAction('mvj/leases/EDIT_CONTACT')(contact);

export const fetchDecisions = (search: string): FetchDecisionsAction =>
  createAction('mvj/leases/FETCH_DECISIONS')(search);

export const receiveDecisions = (decisions: DecisionList): ReceiveDecisionsAction =>
  createAction('mvj/leases/RECEIVE_DECISIONS')(decisions);

export const fetchDistricts = (search: string): FetchDistrictsAction =>
  createAction('mvj/leases/FETCH_DISTRICTS')(search);

export const receiveDistricts = (districts: DistrictList): ReceiveDistrictsAction =>
  createAction('mvj/leases/RECEIVE_DISTRICTS')(districts);

export const fetchLessors = (): FetchLessorsAction =>
  createAction('mvj/leases/FETCH_LESSORS')();

export const receiveLessors = (lessors: LessorList): ReceiveLessorsAction =>
  createAction('mvj/leases/RECEIVE_LESSORS')(lessors);

export const fetchCommentAttributes = (): FetchCommentAttributesAction =>
  createAction('mvj/leases/FETCH_COMMENT_ATTRIBUTES')();

export const receiveCommentAttributes = (identifiers: Attributes): ReceiveCommentAttributesAction =>
  createAction('mvj/leases/RECEIVE_COMMENT_ATTRIBUTES')(identifiers);

export const fetchComments = (leaseId: LeaseId): FetchCommentsAction =>
  createAction('mvj/leases/FETCH_COMMENTS')(leaseId);

export const receiveComments = (comments: Array<Comment>): ReceiveCommentsAction =>
  createAction('mvj/leases/RECEIVE_COMMENTS')(comments);

export const createComment = (comment: Comment): CreateCommentAction =>
  createAction('mvj/leases/CREATE_COMMENT')(comment);

export const receiveCreatedComment = (comment: Comment): ReceiveCreatedCommentAction =>
  createAction('mvj/leases/RECEIVE_CREATED_COMMENT')(comment);

export const editComment = (comment: Comment): EditCommentAction =>
  createAction('mvj/leases/EDIT_COMMENT')(comment);

export const receiveEditedComment = (comment: Comment): ReceiveEditedCommentAction =>
  createAction('mvj/leases/RECEIVE_EDITED_COMMENT')(comment);

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/leases/HIDE_EDIT')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/leases/SHOW_EDIT')();

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

export const receiveRentsFormValid = (valid: boolean): ReceiveRentsFormValidAction =>
  createAction('mvj/leases/RECEIVE_RENTS_FORM_VALID')(valid);

export const receiveSummaryFormValid = (valid: boolean): ReceiveSummaryFormValidAction =>
  createAction('mvj/leases/RECEIVE_SUMMARY_FORM_VALID')(valid);

export const receiveTenantsFormValid = (valid: boolean): ReceiveTenantsFormValidAction =>
  createAction('mvj/leases/RECEIVE_TENANTS_FORM_VALID')(valid);
