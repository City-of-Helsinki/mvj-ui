// @flow
import type {Action, Attributes, Methods} from '$src/types';

export type InvoiceSetCreditState = {
  attributes: Attributes,
  isFetchingAttributes: boolean,
  methods: Methods,
}

export type FetchAttributesAction = Action<'mvj/invoiceSetCredit/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/invoiceSetCredit/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/invoiceSetCredit/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/invoiceSetCredit/ATTRIBUTES_NOT_FOUND', void>;
