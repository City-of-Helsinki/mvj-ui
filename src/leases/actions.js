// @flow

import {createAction} from 'redux-actions';

import type {
  Areas,
  FetchAttributesAction,
  FetchInvoicesAction,
  FetchAreasAction,
  Attributes,
  ReceiveAttributesAction,
  ReceiveInvoicesAction,
  ReceiveAreasAction,
  Lease,
  Invoices,
  LeaseId,
  LeaseNotFoundAction,
  LeasesList,
  CreateLeaseAction,
  EditLeaseAction,
  FetchLeasesAction,
  FetchSingleLeaseAction,
  ReceiveLeasesAction,
  ReceiveSingleLeaseAction,
  HideEditModeAction,
  ShowEditModeAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/leasesbeta/FETCH_ATTRIBUTES')();

export const receiveAttributes = (identifiers: Attributes): ReceiveAttributesAction =>
  createAction('mvj/leasesbeta/RECEIVE_ATTRIBUTES')(identifiers);

export const fetchInvoices = (lease: LeaseId): FetchInvoicesAction =>
  createAction('mvj/leasesbeta/FETCH_INVOICES')(lease);

export const receiveInvoices = (invoices: Invoices): ReceiveInvoicesAction =>
  createAction('mvj/leasesbeta/RECEIVE_INVOICES')(invoices);

export const fetchAreas = (): FetchAreasAction =>
  createAction('mvj/leasesbeta/FETCH_AREAS')();

export const receiveAreas = (areas: Areas): ReceiveAreasAction =>
  createAction('mvj/leasesbeta/RECEIVE_AREAS')(areas);

export const fetchLeases = (search: string): FetchLeasesAction =>
  createAction('mvj/leasesbeta/FETCH_ALL')(search);

export const receiveLeases = (leases: LeasesList): ReceiveLeasesAction =>
  createAction('mvj/leasesbeta/RECEIVE_ALL')(leases);

export const fetchSingleLease = (id: LeaseId): FetchSingleLeaseAction =>
  createAction('mvj/leasesbeta/FETCH_SINGLE')(id);

export const receiveSingleLease = (lease: Lease): ReceiveSingleLeaseAction =>
  createAction('mvj/leasesbeta/RECEIVE_SINGLE')(lease);

export const createLease = (lease: Lease): CreateLeaseAction =>
  createAction('mvj/leasesbeta/CREATE')(lease);

export const editLease = (lease: Lease): EditLeaseAction =>
  createAction('mvj/leasesbeta/EDIT')(lease);

export const notFound = (): LeaseNotFoundAction =>
  createAction('mvj/leasesbeta/NOT_FOUND')();

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/leasesbeta/HIDE_EDIT')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/leasesbeta/SHOW_EDIT')();
