import type { Action } from "@/types";
import type { ContactId } from "@/contacts/types";
import type { LeaseId } from "@/leases/types";
import type { AreaSearchId } from "@/areaSearch/types";
export type AuditLogState = {
  byContact: AuditLogListMap;
  byLease: AuditLogListMap;
  byAreaSearch: AuditLogListMap;
  isFetchingByContact: AuditLogIsFetchingMap;
  isFetchingByLease: AuditLogIsFetchingMap;
  isFetchingByAreaSearch: AuditLogIsFetchingMap;
};
export type AuditLogList = any;
export type AuditLogListMap = Record<string, AuditLogList>;
export type AuditLogIsFetchingMap = Record<string, boolean>;
export type FetchAuditLogByContactAction = Action<string, ContactId>;
export type ReceiveAuditLogByContactAction = Action<string, AuditLogListMap>;
export type NotFoundByContactAction = Action<string, ContactId>;
export type FetchAuditLogByLeaseAction = Action<string, Record<string, any>>;
export type ReceiveAuditLogByLeaseAction = Action<string, AuditLogListMap>;
export type NotFoundByLeaseAction = Action<string, LeaseId>;
export type FetchAuditLogByAreaSearchAction = Action<
  string,
  Record<string, any>
>;
export type ReceiveAuditLogByAreaSearchAction = Action<string, AuditLogListMap>;
export type NotFoundByAreaSearchAction = Action<string, AreaSearchId>;
