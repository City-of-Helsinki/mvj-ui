// @flow
import type {Action} from '../types';
import type {LeaseId} from '$src/leases/types';

export type InvoiceSetState = {
  byLease: InvoiceSetListMap,
  isFetching: boolean,
};

export type InvoiceSetList = Array<Object>;
export type InvoiceSetListMap = {[key: number]: InvoiceSetList};

export type FetchInvoiceSetsByLeaseAction = Action<'mvj/invoiceSets/FETCH_BY_LEASE', LeaseId>;
export type ReceiveInvoiceSetsByLeaseAction = Action<'mvj/invoiceSets/RECEIVE_BY_LEASE', Object>;
export type CreditInvoiceSetAction = Action<'mvj/invoiceSets/CREDIT_INVOICESET', Object>;
export type InvoiceSetsNotFoundAction = Action<'mvj/invoiceSets/NOT_FOUND', void>;
