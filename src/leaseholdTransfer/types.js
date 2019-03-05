// @flow
import type {Action, Attributes, Methods} from '$src/types';

export type LeaseholdTransferState = {
  attributes: Attributes,
  isFetchingAttributes: boolean,
  methods: Methods,
}

export type FetchAttributesAction = Action<'mvj/leaseholdTransfer/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/leaseholdTransfer/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/leaseholdTransfer/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/leaseholdTransfer/ATTRIBUTES_NOT_FOUND', void>;
