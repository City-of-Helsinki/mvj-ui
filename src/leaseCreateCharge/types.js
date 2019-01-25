// @flow
import type {Action, Attributes} from '$src/types';

export type LeaseCreateChargeState = {
  attributes: Attributes,
  isFetchingAttributes: boolean,
}

export type FetchAttributesAction = Action<'mvj/leaseCreateCharge/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/leaseCreateCharge/RECEIVE_ATTRIBUTES', Attributes>;
export type AttributesNotFoundAction = Action<'mvj/leaseCreateCharge/ATTRIBUTES_NOT_FOUND', void>;
