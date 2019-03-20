// @flow
import type {RootState} from '$src/root/types';
import type {Selector} from '$src/types';

export const getIsFetchingByContact: Selector<boolean, string> = (state: RootState, contactId: string): boolean =>
  state.auditLog.isFetchingByContact[contactId];

export const getAuditLogByContact: Selector<boolean, string> = (state: RootState, contactId: string): boolean =>
  state.auditLog.byContact[contactId];

export const getIsFetchingByLease: Selector<boolean, string> = (state: RootState, leaseId: string): boolean =>
  state.auditLog.isFetchingByLease[leaseId];

export const getAuditLogByLease: Selector<boolean, string> = (state: RootState, leaseId: string): boolean =>
  state.auditLog.byLease[leaseId];
