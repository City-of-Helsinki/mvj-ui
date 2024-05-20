import type { Action } from "src/types";
import type { LeaseId } from "src/leases/types";
export type RentForPeriodId = number;
export type RentForPeriodState = {
  byLease: Record<string, any>;
  isFetching: boolean;
  isSaveClicked: boolean;
};
export type FetchRentForPeriodPayload = {
  id: RentForPeriodId;
  allowDelete: boolean;
  leaseId: LeaseId;
  type: "year" | "range" | "billing_period";
  startDate: string;
  endDate: string;
};
export type DeleteRentForPeriodPayload = {
  id: RentForPeriodId;
  leaseId: LeaseId;
};
export type RentForPeriod = Record<string, any>;
export type FetchRentForPeriodAction = Action<string, FetchRentForPeriodPayload>;
export type ReceiveRentForPeriodByLeaseAction = Action<string, RentForPeriod>;
export type DeleteRentForPeriodByLeaseAction = Action<string, DeleteRentForPeriodPayload>;
export type RentForPeriodNotFoundAction = Action<string, void>;
export type ReceiveIsSaveClickedAction = Action<string, boolean>;