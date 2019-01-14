// @flow
import type {Action, Attributes, Methods} from '$src/types';

export type LeaseCreateChargeState = {
  attributes: Attributes,
  isFetchingAttributes: boolean,
  methods: Methods,
}

export type FetchAttributesAction = Action<'mvj/leaseCreateCharge/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/leaseCreateCharge/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/leaseCreateCharge/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/leaseCreateCharge/ATTRIBUTES_NOT_FOUND', void>;
