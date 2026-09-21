import type { LeaseId } from "@/leases/types";
export type BillingPeriodState = {
  byLease: Record<string, BillingPeriodList>;
  isFetching: boolean;
};
export type FetchBillingPeriodsPayload = {
  leaseId: LeaseId;
  year: string;
};
export type ReceiveBillingPeriodsPayload = {
  leaseId: LeaseId;
  billingPeriods: BillingPeriodList;
};
export type BillingPeriod = [string, string];
export type BillingPeriodList = Array<BillingPeriod>;
