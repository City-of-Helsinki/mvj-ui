// @flow
import {createAction} from 'redux-actions';

import type {ContactId} from '$src/contacts/types';
import type {LeaseId} from '$src/leases/types';
import type {AreaSearchId} from '$src/areaSearch/types';
import type {
  AuditLogListMap,
  FetchAuditLogByContactAction,
  ReceiveAuditLogByContactAction,
  NotFoundByContactAction,
  FetchAuditLogByLeaseAction,
  ReceiveAuditLogByLeaseAction,
  NotFoundByLeaseAction,
  FetchAuditLogByAreaSearchAction,
  ReceiveAuditLogByAreaSearchAction,
  NotFoundByAreaSearchAction
} from '$src/auditLog/types';

export const fetchAuditLogByContact = (contactId: ContactId): FetchAuditLogByContactAction =>
  createAction('mvj/auditLog/FETCH_BY_CONTACT')(contactId);

export const receiveAuditLogByContact = (payload: AuditLogListMap): ReceiveAuditLogByContactAction =>
  createAction('mvj/auditLog/RECEIVE_BY_CONTACT')(payload);

export const notFoundByContact = (contactId: ContactId): NotFoundByContactAction =>
  createAction('mvj/auditLog/NOT_FOUND_BY_CONTACT')(contactId);

export const fetchAuditLogByLease = (query: Object): FetchAuditLogByLeaseAction =>
  createAction('mvj/auditLog/FETCH_BY_LEASE')(query);

export const receiveAuditLogByLease = (payload: AuditLogListMap): ReceiveAuditLogByLeaseAction =>
  createAction('mvj/auditLog/RECEIVE_BY_LEASE')(payload);

export const notFoundByLease = (leaseId: LeaseId): NotFoundByLeaseAction =>
  createAction('mvj/auditLog/NOT_FOUND_BY_LEASE')(leaseId);

export const fetchAuditLogByAreaSearch = (query: Object): FetchAuditLogByAreaSearchAction =>
  createAction('mvj/auditLog/FETCH_BY_AREASEARCH')(query);

export const receiveAuditLogByAreaSearch = (payload: AuditLogListMap): ReceiveAuditLogByAreaSearchAction =>
  createAction('mvj/auditLog/RECEIVE_BY_AREASEARCH')(payload);

export const notFoundByAreaSearch = (areaSearchId: AreaSearchId): NotFoundByAreaSearchAction =>
  createAction('mvj/auditLog/NOT_FOUND_BY_AREASEARCH')(areaSearchId);
