import type { Action } from "../types";
export type LeaseTypeList = Array<Record<string, any>>;
export type LeaseTypeState = {
  isFetching: boolean;
  list: LeaseTypeList;
};
export type FetchLeaseTypesAction = Action<"mvj/leaseType/FETCH_ALL", void>;
export type ReceiveLeaseTypesAction = Action<"mvj/leaseType/RECEIVE_ALL", LeaseTypeList>;
export type LeaseTypesNotFoundAction = Action<"mvj/leaseType/NOT_FOUND", void>;