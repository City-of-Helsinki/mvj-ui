import type { Action } from "../types";
import type { LeaseId } from "src/leases/types";
export type BillingPeriodState = {
  byLease: Record<string, any>;
  isFetching: boolean;
};
export type FetchBillingPeriodsPayload = {
  leaseId: LeaseId;
  year: number;
};
export type BillingPeriodList = Array<Record<string, any>>;
export type FetchBillingPeriodsAction = Action<string, FetchBillingPeriodsPayload>;
export type ReceiveBillingPeriodsAction = Action<string, Record<string, any>>;
export type BillingPeriodsNotFoundAction = Action<string, void>;