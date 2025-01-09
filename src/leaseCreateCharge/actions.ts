import { createAction } from "redux-actions";
import type { Attributes } from "types";
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  AttributesNotFoundAction,
  FetchReceivableTypesAction,
  ReceiveReceivableTypesAction,
  ReceivableTypesNotFoundAction,
} from "./types";
export const fetchAttributes = (): FetchAttributesAction =>
  createAction("mvj/leaseCreateCharge/FETCH_ATTRIBUTES")();
export const receiveAttributes = (
  attributes: Attributes,
): ReceiveAttributesAction =>
  createAction("mvj/leaseCreateCharge/RECEIVE_ATTRIBUTES")(attributes);
export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction("mvj/leaseCreateCharge/ATTRIBUTES_NOT_FOUND")();
export const fetchReceivableTypes = (): FetchReceivableTypesAction =>
  createAction("mvj/leaseCreateCharge/FETCH_RECEIVABLE_TYPES")();
export const receiveReceivableTypes = (
  receivableTypes: Record<string, any>,
): ReceiveReceivableTypesAction =>
  createAction("mvj/leaseCreateCharge/RECEIVE_RECEIVABLE_TYPES")(
    receivableTypes,
  );
export const receivableTypesNotFound = (): ReceivableTypesNotFoundAction =>
  createAction("mvj/leaseCreateCharge/RECEIVABLE_TYPES_NOT_FOUND")();
