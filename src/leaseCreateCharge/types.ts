import type { Action, Attributes } from "types";
export type LeaseCreateChargeState = {
  attributes: Attributes;
  isFetchingAttributes: boolean;
  receivableTypes: Record<string, any>;
  isFetchingReceivableTypes: boolean;
};
export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type AttributesNotFoundAction = Action<string, void>;
export type FetchReceivableTypesAction = Action<string, void>;
export type ReceiveReceivableTypesAction = Action<string, Record<string, any>>;
export type ReceivableTypesNotFoundAction = Action<string, void>;