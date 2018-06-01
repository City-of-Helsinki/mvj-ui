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
  LeaseNotFoundByIdAction,
  LeaseList,
  CreateLeaseAction,
  PatchLeaseAction,
  FetchLeasesAction,
  FetchSingleLeaseAction,
  ReceiveLeasesAction,
  ReceiveSingleLeaseAction,
  FetchLeaseByIdAction,
  ReceiveLeaseByIdAction,
  StartInvoicingAction,
  StopInvoicingAction,
  HideContactModalAction,
  ShowContactModalAction,
  ContactModalSettings,
  ReceiveContactModalSettingsAction,
  CreateContactAction,
  EditContactAction,
  HideEditModeAction,
  ShowEditModeAction,
  CreateRelatedLeasePayload,
  CreateRelatedLeaseAction,
  DeleteRelatedLeasePayload,
  DeleteRelatedLeaseAction,
  HideDeleteRelatedLeaseModalAction,
  ShowDeleteRelatedLeaseModalAction,
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

export const fetchLeaseById = (id: LeaseId): FetchLeaseByIdAction =>
  createAction('mvj/leases/FETCH_BY_ID')(id);

export const receiveLeaseById = (lease: Lease): ReceiveLeaseByIdAction =>
  createAction('mvj/leases/RECEIVE_BY_ID')(lease);

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

export const notFoundById = (id: LeaseId): LeaseNotFoundByIdAction =>
  createAction('mvj/leases/NOT_FOUND_BY_ID')(id);

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

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/leases/HIDE_EDIT')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/leases/SHOW_EDIT')();

export const createReleatedLease = (payload: CreateRelatedLeasePayload): CreateRelatedLeaseAction =>
  createAction('mvj/leases/CREATE_RELATED_LEASE')(payload);

export const deleteReleatedLease = (payload: DeleteRelatedLeasePayload): DeleteRelatedLeaseAction =>
  createAction('mvj/leases/DELETE_RELATED_LEASE')(payload);

export const hideDeleteRelatedLeaseModal = (): HideDeleteRelatedLeaseModalAction =>
  createAction('mvj/leases/HIDE_RELATED_LEASE_MODAL')();

export const showDeleteRelatedLeaseModal = (): ShowDeleteRelatedLeaseModalAction =>
  createAction('mvj/leases/SHOW_RELATED_LEASE_MODAL')();

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
