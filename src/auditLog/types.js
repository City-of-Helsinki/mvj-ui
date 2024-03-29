// @flow
import type {Action} from '../types';
import type {ContactId} from '$src/contacts/types';
import type {LeaseId} from '$src/leases/types';
import type {AreaSearchId} from '$src/areaSearch/types';

export type AuditLogState = {
  byContact: AuditLogListMap,
  byLease: AuditLogListMap,
  byAreaSearch: AuditLogListMap,
  isFetchingByContact: AuditLogIsFetchingMap,
  isFetchingByLease: AuditLogIsFetchingMap,
  isFetchingByAreaSearch: AuditLogIsFetchingMap,
}

export type AuditLogList = Object;

export type AuditLogListMap = {
  [id: string]: AuditLogList,
}

export type AuditLogIsFetchingMap = {
  [id: string]: boolean,
}

export type FetchAuditLogByContactAction = Action<'mvj/auditLog/FETCH_BY_CONTACT', ContactId>;
export type ReceiveAuditLogByContactAction = Action<'mvj/auditLog/RECEIVE_BY_CONTACT', AuditLogListMap>;
export type NotFoundByContactAction = Action<'mvj/auditLog/NOT_FOUND_BY_CONTACT', ContactId>;
export type FetchAuditLogByLeaseAction = Action<'mvj/auditLog/FETCH_BY_LEASE', Object>;
export type ReceiveAuditLogByLeaseAction = Action<'mvj/auditLog/RECEIVE_BY_LEASE', AuditLogListMap>;
export type NotFoundByLeaseAction = Action<'mvj/auditLog/NOT_FOUND_BY_LEASE', LeaseId>;
export type FetchAuditLogByAreaSearchAction = Action<'mvj/auditLog/FETCH_BY_AREASEARCH', Object>;
export type ReceiveAuditLogByAreaSearchAction = Action<'mvj/auditLog/RECEIVE_BY_AREASEARCH', AuditLogListMap>;
export type NotFoundByAreaSearchAction = Action<'mvj/auditLog/NOT_FOUND_BY_AREASEARCH', AreaSearchId>;
