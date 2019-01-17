// @flow
import type {Action, Attributes, Methods} from '../types';
import type {LeaseId} from '$src/leases/types';

export type InvoiceSetState = {
  attributes: Attributes,
  byLease: InvoiceSetListMap,
  isFetching: boolean,
  isFetchingAttributes: boolean,
  methods: Methods,
};

export type InvoiceSetList = Array<Object>;
export type InvoiceSetListMap = {[key: number]: InvoiceSetList};

export type FetchAttributesAction = Action<'mvj/invoiceSets/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/invoiceSets/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/invoiceSets/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/invoiceSets/ATTRIBUTES_NOT_FOUND', void>;

export type FetchInvoiceSetsByLeaseAction = Action<'mvj/invoiceSets/FETCH_BY_LEASE', LeaseId>;
export type ReceiveInvoiceSetsByLeaseAction = Action<'mvj/invoiceSets/RECEIVE_BY_LEASE', Object>;
export type CreditInvoiceSetAction = Action<'mvj/invoiceSets/CREDIT_INVOICESET', Object>;
export type InvoiceSetsNotFoundAction = Action<'mvj/invoiceSets/NOT_FOUND', void>;
