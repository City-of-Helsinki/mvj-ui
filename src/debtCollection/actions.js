// @flow
import {createAction} from 'redux-actions';

import type {InvoiceId} from '$src/invoices/types';
import type {
  FetchCollectionCostsByInvoiceAction,
  ReceiveCollectionCostsByInvoiceAction,
  CollectionCostsNotFoundByInvoiceAction,
} from './types';

export const fetchCollectionCostsByInvoice = (invoiceId: InvoiceId): FetchCollectionCostsByInvoiceAction =>
  createAction('mvj/debtCollection/FETCH_COLLECTION_COSTS_BY_INVOICE')(invoiceId);

export const receiveCollectionCostsByInvoice = (collectionCosts: Object): ReceiveCollectionCostsByInvoiceAction =>
  createAction('mvj/debtCollection/RECEIVE_COLLECTION_COSTS_BY_INVOICE')(collectionCosts);

export const collectionCostsNotFoundByInvoice = (invoiceId: InvoiceId): CollectionCostsNotFoundByInvoiceAction =>
  createAction('mvj/debtCollection/COLLECTION_COSTS_NOT_FOUND_BY_INVOICE')(invoiceId);
