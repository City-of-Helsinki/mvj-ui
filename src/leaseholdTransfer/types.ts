import type { Action, Attributes, Methods } from "types";
export type LeaseholdTransferState = {
  attributes: Attributes;
  isFetching: boolean;
  isFetchingAttributes: boolean;
  list: LeaseholdTransferList;
  methods: Methods;
};
export type LeaseholdTransferList = any;
export type DeleteAndUpdateLeaseholdTrasferPayload = {
  id: number;
  searchQuery: Record<string, any>;
};
export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type ReceiveMethodsAction = Action<string, Methods>;
export type AttributesNotFoundAction = Action<string, void>;
export type FetchLeaseholdTransferListAction = Action<
  string,
  Record<string, any> | null | undefined
>;
export type ReceiveLeaseholdTransferListAction = Action<
  string,
  LeaseholdTransferList
>;
export type DeleteLeaseholdTransferAndUpdateListAction = Action<
  string,
  DeleteAndUpdateLeaseholdTrasferPayload
>;
export type NotFoundAction = Action<string, void>;
