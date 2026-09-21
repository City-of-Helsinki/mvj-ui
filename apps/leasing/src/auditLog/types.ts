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
