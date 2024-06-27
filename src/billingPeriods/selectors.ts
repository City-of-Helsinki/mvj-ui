import type { Selector } from "types";
import type { RootState } from "/src/root/types";
import type { LeaseId } from "/src/leases/types";
export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean => state.billingPeriod.isFetching;
export const getBillingPeriodsByLease: Selector<Record<string, any>, LeaseId> = (state: RootState, leaseId: LeaseId): Record<string, any> => {
  return state.billingPeriod.byLease[leaseId];
};