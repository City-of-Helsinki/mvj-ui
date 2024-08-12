import type { Selector } from "types";
import type { RootState } from "root/types";
import type { LeaseId } from "leases/types";
export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean => state.billingPeriod.isFetching;
export const getBillingPeriodsByLease: Selector<Record<string, any>, LeaseId> = (state: RootState, leaseId: LeaseId): Record<string, any> => {
  return state.billingPeriod.byLease[leaseId];
};