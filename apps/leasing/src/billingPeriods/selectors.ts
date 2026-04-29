import type { Selector } from "types";
import type { RootState } from "@/root/types";
import type { LeaseId } from "@/leases/types";
import type { BillingPeriodList } from "./types";
export const getIsFetching: Selector<boolean, void> = (
  state: RootState,
): boolean => state.billingPeriod.isFetching;
export const getBillingPeriodsByLease: Selector<BillingPeriodList, LeaseId> = (
  state: RootState,
  leaseId: LeaseId,
): BillingPeriodList => {
  return state.billingPeriod.byLease[leaseId];
};
