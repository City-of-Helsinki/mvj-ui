import type { Action } from "types";
import type { LeaseId } from "@/leases/types";
import { RentCalculatorTypes } from "@/components/enums";
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
  type: RentCalculatorType;
  startDate: string;
  endDate: string;
};
export type RentCalculatorType =
  (typeof RentCalculatorTypes)[keyof typeof RentCalculatorTypes];
export type DeleteRentForPeriodPayload = {
  id: RentForPeriodId;
  leaseId: LeaseId;
};
export type RentForPeriod = Record<string, any>;
export type FetchRentForPeriodAction = Action<
  string,
  FetchRentForPeriodPayload
>;
export type ReceiveRentForPeriodByLeaseAction = Action<string, RentForPeriod>;
export type DeleteRentForPeriodByLeaseAction = Action<
  string,
  DeleteRentForPeriodPayload
>;
export type RentForPeriodNotFoundAction = Action<string, void>;
export type ReceiveIsSaveClickedAction = Action<string, boolean>;
