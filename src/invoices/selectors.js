// @flow

import type {Selector} from '../types';

import type {
  Attributes,
  InvoiceState,
  InvoiceList,
} from './types';

export const getIsFetching: Selector<boolean, void> = (state: InvoiceState): boolean =>
  state.invoice.isFetching;

export const getIsCreateOpen: Selector<boolean, void> = (state: InvoiceState): boolean =>
  state.invoice.isCreateOpen;

export const getAttributes: Selector<Attributes, void> = (state: InvoiceState): InvoiceState =>
  state.invoice.attributes;

export const getInvoices: Selector<InvoiceList, void> = (state: InvoiceState): InvoiceList =>
  state.invoice.invoices;
