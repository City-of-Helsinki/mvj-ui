// @flow

import {createAction} from 'redux-actions';

import type {Attributes, Methods} from '$src/types';
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  Lease,
  LeaseId,
  LeaseAttributesNotFoundAction,
  LeaseNotFoundAction,
  LeaseNotFoundByIdAction,
  LeaseList,
  CreateLeaseAction,
  DeleteLeaseAction,
  PatchLeaseAction,
  FetchLeasesAction,
  FetchSingleLeaseAction,
  FetchSingleLeaseAfterEditAction,
  FetchSingleLeaseAfterEditPayload,
  ReceiveLeasesAction,
  ReceiveSingleLeaseAction,
  FetchLeaseByIdAction,
  ReceiveLeaseByIdAction,
  StartInvoicingAction,
  StopInvoicingAction,
  SetRentInfoCompleteAction,
  SetRentInfoUncompleteAction,
  HideEditModeAction,
  ShowEditModeAction,
  CopyAreasToContractAction,
  ReceiveFormValidFlagsAction,
  ClearFormValidFlagsAction,
  ReceiveIsSaveClickedAction,
  ReceiveCollapseStatesAction,
  CreateChargePayload,
  CreateChargeAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/leases/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/leases/RECEIVE_ATTRIBUTES')(attributes);

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/leases/RECEIVE_METHODS')(methods);

export const fetchLeases = (search: string): FetchLeasesAction =>
  createAction('mvj/leases/FETCH_ALL')(search);

export const receiveLeases = (leases: LeaseList): ReceiveLeasesAction =>
  createAction('mvj/leases/RECEIVE_ALL')(leases);

export const fetchSingleLease = (id: LeaseId): FetchSingleLeaseAction =>
  createAction('mvj/leases/FETCH_SINGLE')(id);

export const fetchSingleLeaseAfterEdit = (payload: FetchSingleLeaseAfterEditPayload): FetchSingleLeaseAfterEditAction =>
  createAction('mvj/leases/FETCH_SINGLE_AFTER_EDIT')(payload);

export const receiveSingleLease = (lease: Lease): ReceiveSingleLeaseAction =>
  createAction('mvj/leases/RECEIVE_SINGLE')(lease);

export const fetchLeaseById = (id: LeaseId): FetchLeaseByIdAction =>
  createAction('mvj/leases/FETCH_BY_ID')(id);

export const receiveLeaseById = (lease: Lease): ReceiveLeaseByIdAction =>
  createAction('mvj/leases/RECEIVE_BY_ID')(lease);

export const createLease = (lease: Lease): CreateLeaseAction =>
  createAction('mvj/leases/CREATE')(lease);

export const deleteLease = (leaseId: LeaseId): DeleteLeaseAction =>
  createAction('mvj/leases/DELETE')(leaseId);

export const patchLease = (lease: Lease): PatchLeaseAction =>
  createAction('mvj/leases/PATCH')(lease);

export const startInvoicing = (id: LeaseId): StartInvoicingAction =>
  createAction('mvj/leases/START_INVOICING')(id);

export const stopInvoicing = (id: LeaseId): StopInvoicingAction =>
  createAction('mvj/leases/STOP_INVOICING')(id);

export const setRentInfoComplete = (leaseId: LeaseId): SetRentInfoCompleteAction =>
  createAction('mvj/leases/SET_RENT_INFO_COMPLETE')(leaseId);

export const setRentInfoUncomplete = (leaseId: LeaseId): SetRentInfoUncompleteAction =>
  createAction('mvj/leases/SET_RENT_INFO_UNCOMPLETE')(leaseId);

export const attributesNotFound = (): LeaseAttributesNotFoundAction =>
  createAction('mvj/leases/ATTRIBUTES_NOT_FOUND')();

export const notFound = (): LeaseNotFoundAction =>
  createAction('mvj/leases/NOT_FOUND')();

export const notFoundById = (id: LeaseId): LeaseNotFoundByIdAction =>
  createAction('mvj/leases/NOT_FOUND_BY_ID')(id);

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/leases/HIDE_EDIT')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/leases/SHOW_EDIT')();

export const copyAreasToContract = (leaseId: LeaseId): CopyAreasToContractAction =>
  createAction('mvj/leases/COPY_AREAS_TO_CONTRACT')(leaseId);

export const receiveFormValidFlags = (valid: Object): ReceiveFormValidFlagsAction =>
  createAction('mvj/leases/RECEIVE_FORM_VALID_FLAGS')(valid);

export const clearFormValidFlags = (): ClearFormValidFlagsAction =>
  createAction('mvj/leases/CLEAR_FORM_VALID_FLAGS')();

export const receiveIsSaveClicked = (isClicked: boolean): ReceiveIsSaveClickedAction =>
  createAction('mvj/leases/RECEIVE_SAVE_CLICKED')(isClicked);

export const receiveCollapseStates = (status: Object): ReceiveCollapseStatesAction =>
  createAction('mvj/leases/RECEIVE_COLLAPSE_STATES')(status);

export const createCharge = (payload: CreateChargePayload): CreateChargeAction =>
  createAction('mvj/leases/CREATE_CHARGE')(payload);
