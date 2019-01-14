// @flow
import type {Action, Attributes, Methods} from '$src/types';

export type InvoiceCreditState = {
  attributes: Attributes,
  isFetchingAttributes: boolean,
  methods: Methods,
}

export type FetchAttributesAction = Action<'mvj/invoiceCredit/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/invoiceCredit/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/invoiceCredit/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/invoiceCredit/ATTRIBUTES_NOT_FOUND', void>;
