// @flow
import type {Selector} from '$src/types';
import type {InvoiceId} from '$src/invoices/types';
import type {DebtCollectionState} from './types';

export const getCollectionCostsByInvoice: Selector<boolean, InvoiceId> = (state: DebtCollectionState, id: InvoiceId): boolean =>
  state.debtCollection.collectionCostsByInvoice[id];

export const getIsFetchingCollectionCostsByInvoice: Selector<boolean, InvoiceId> = (state: DebtCollectionState, id: InvoiceId): boolean =>
  state.debtCollection.isFetchingCollectionCostsByInvoice[id];
