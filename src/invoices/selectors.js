// @flow

import type {Selector} from '../types';

import type {
  Attributes,
  InvoiceState,
  Invoice,
  InvoiceList,
} from './types';

export const getIsFetching: Selector<boolean, void> = (state: InvoiceState): boolean =>
  state.invoice.isFetching;

export const getIsCreateInvoicePanelOpen: Selector<boolean, void> = (state: InvoiceState): boolean =>
  state.invoice.isCreatePanelOpen;

export const getIsCreditInvoicePanelOpen: Selector<boolean, void> = (state: InvoiceState): boolean =>
  state.invoice.isCreditPanelOpen;

export const getAttributes: Selector<Attributes, void> = (state: InvoiceState): InvoiceState =>
  state.invoice.attributes;

export const getInvoices: Selector<InvoiceList, void> = (state: InvoiceState): InvoiceList =>
  state.invoice.invoices;

export const getPatchedInvoice: Selector<?Invoice, void> = (state: InvoiceState): ?Invoice =>
  state.invoice.patchedInvoice;
