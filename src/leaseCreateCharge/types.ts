import type { Action, Attributes } from "src/types";
export type LeaseCreateChargeState = {
  attributes: Attributes;
  isFetchingAttributes: boolean;
  receivableTypes: Record<string, any>;
  isFetchingReceivableTypes: boolean;
};
export type FetchAttributesAction = Action<"mvj/leaseCreateCharge/FETCH_ATTRIBUTES", void>;
export type ReceiveAttributesAction = Action<"mvj/leaseCreateCharge/RECEIVE_ATTRIBUTES", Attributes>;
export type AttributesNotFoundAction = Action<"mvj/leaseCreateCharge/ATTRIBUTES_NOT_FOUND", void>;
export type FetchReceivableTypesAction = Action<"mvj/leaseCreateCharge/FETCH_RECEIVABLE_TYPES", void>;
export type ReceiveReceivableTypesAction = Action<"mvj/leaseCreateCharge/RECEIVE_RECEIVABLE_TYPES", Record<string, any>>;
export type ReceivableTypesNotFoundAction = Action<"mvj/leaseCreateCharge/RECEIVABLE_TYPES_NOT_FOUND", void>;