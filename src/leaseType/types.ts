import type { Action } from "@/types";
export type LeaseTypeList = Array<Record<string, any>>;
export type LeaseTypeState = {
  isFetching: boolean;
  list: LeaseTypeList;
};
export type FetchLeaseTypesAction = Action<string, void>;
export type ReceiveLeaseTypesAction = Action<string, LeaseTypeList>;
export type LeaseTypesNotFoundAction = Action<string, void>;