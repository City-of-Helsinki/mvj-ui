// @flow
import type {Action, Attributes, Methods} from '$src/types';
import type {InvoiceId} from '$src/invoices/types';

export type PenaltyInterestState = {
  attributes: Attributes,
  byInvoice: Object,
  isFetchingAttributes: boolean,
  isFetchingByInvoice: Object,
  methods: Methods,
};

export type FetchAttributesAction = Action<'mvj/penaltyInterest/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/penaltyInterest/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/penaltyInterest/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/penaltyInterest/ATTRIBUTES_NOT_FOUND', void>;

export type FetchPenaltyInterestByInvoiceAction = Action<'mvj/penaltyInterest/FETCH_BY_INVOICE', InvoiceId>;
export type ReceivePenaltyInterestByInvoiceAction = Action<'mvj/penaltyInterest/RECEIVE_BY_INVOICE', Object>;
export type PenaltyInterestNotFoundByInvoiceAction = Action<'mvj/penaltyInterest/NOT_FOUND_BY_INVOICE', InvoiceId>;
