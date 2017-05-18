// @flow

import {createAction} from 'redux-actions';

import type {
  FetchIdentifiersAction,
  Identifiers,
  ReceiveIdentifiersAction,
  Lease,
  LeaseId,
  LeaseNotFoundAction,
  LeasesList,
  CreateLeaseAction,
  EditLeaseAction,
  FetchLeasesAction,
  FetchSingleLeaseAction,
  ReceiveLeasesAction,
  ReceiveSingleLeaseAction,
} from './types';

export const fetchIdentifiers = (): FetchIdentifiersAction =>
  createAction('mvj/leases/FETCH_IDENTIFIERS')();

export const receiveIdentifiers = (identifiers: Identifiers): ReceiveIdentifiersAction =>
  createAction('mvj/leases/RECEIVE_IDENTIFIERS')(identifiers);

export const fetchLeases = (): FetchLeasesAction =>
  createAction('mvj/leases/FETCH_ALL')();

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

export const notFound = (): LeaseNotFoundAction =>
  createAction('mvj/leases/NOT_FOUND')();
