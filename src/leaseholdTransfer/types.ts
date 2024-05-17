import type { Action, Attributes, Methods } from "src/types";
export type LeaseholdTransferState = {
  attributes: Attributes;
  isFetching: boolean;
  isFetchingAttributes: boolean;
  list: LeaseholdTransferList;
  methods: Methods;
};
export type LeaseholdTransferList = Record<string, any>;
export type DeleteAndUpdateLeaseholdTrasferPayload = {
  id: number;
  searchQuery: Record<string, any>;
};
export type FetchAttributesAction = Action<"mvj/leaseholdTransfer/FETCH_ATTRIBUTES", void>;
export type ReceiveAttributesAction = Action<"mvj/leaseholdTransfer/RECEIVE_ATTRIBUTES", Attributes>;
export type ReceiveMethodsAction = Action<"mvj/leaseholdTransfer/RECEIVE_METHODS", Methods>;
export type AttributesNotFoundAction = Action<"mvj/leaseholdTransfer/ATTRIBUTES_NOT_FOUND", void>;
export type FetchLeaseholdTransferListAction = Action<"mvj/leaseholdTransfer/FETCH_ALL", Record<string, any> | null | undefined>;
export type ReceiveLeaseholdTransferListAction = Action<"mvj/leaseholdTransfer/RECEIVE_ALL", LeaseholdTransferList>;
export type DeleteLeaseholdTransferAndUpdateListAction = Action<"mvj/leaseholdTransfer/DELETE_AND_UPDATE", DeleteAndUpdateLeaseholdTrasferPayload>;
export type NotFoundAction = Action<"mvj/leaseholdTransfer/NOT_FOUND", void>;