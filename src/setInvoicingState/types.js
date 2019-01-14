// @flow
import type {Action, Attributes, Methods} from '$src/types';

export type SetInvoicingStateState = {
  attributes: Attributes,
  isFetchingAttributes: boolean,
  methods: Methods,
}

export type FetchAttributesAction = Action<'mvj/setInvoicingState/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/setInvoicingState/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/setInvoicingState/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/setInvoicingState/ATTRIBUTES_NOT_FOUND', void>;
