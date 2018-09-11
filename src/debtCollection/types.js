// @flow
import type {Action} from '$src/types';
import type {InvoiceId} from '$src/invoices/types';

export type DebtCollectionState = Object;

export type FetchCollectionCostsByInvoiceAction = Action<'mvj/debtCollection/FETCH_COLLECTION_COSTS_BY_INVOICE', InvoiceId>;
export type ReceiveCollectionCostsByInvoiceAction = Action<'mvj/debtCollection/RECEIVE_COLLECTION_COSTS_BY_INVOICE', Object>;
export type CollectionCostsNotFoundByInvoiceAction = Action<'mvj/debtCollection/COLLECTION_COSTS_NOT_FOUND_BY_INVOICE', InvoiceId>;
