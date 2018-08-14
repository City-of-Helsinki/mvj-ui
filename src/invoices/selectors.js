// @flow

import type {Selector} from '../types';

import type {
  Attributes,
  InvoiceState,
  Invoice,
  InvoiceList,
} from './types';
import type {LeaseId} from '$src/leases/types';

export const getIsFetching: Selector<boolean, void> = (state: InvoiceState): boolean =>
  state.invoice.isFetching;

export const getIsCreateInvoicePanelOpen: Selector<boolean, void> = (state: InvoiceState): boolean =>
  state.invoice.isCreatePanelOpen;

export const getIsCreditInvoicePanelOpen: Selector<boolean, void> = (state: InvoiceState): boolean =>
  state.invoice.isCreditPanelOpen;

export const getIsCreateClicked: Selector<boolean, void> = (state: InvoiceState): boolean =>
  state.invoice.isCreateClicked;

export const getIsCreditClicked: Selector<boolean, void> = (state: InvoiceState): boolean =>
  state.invoice.isCreditClicked;

export const getIsEditClicked: Selector<boolean, void> = (state: InvoiceState): boolean =>
  state.invoice.isEditClicked;

export const getAttributes: Selector<Attributes, void> = (state: InvoiceState): InvoiceState =>
  state.invoice.attributes;

export const getInvoicesByLease: Selector<InvoiceList, LeaseId> = (state: InvoiceState, leaseId: LeaseId): InvoiceList =>
  state.invoice.byLease[leaseId];

export const getInvoiceToCredit: Selector<?string, void> = (state: InvoiceState): ?string =>
  state.invoice.invoiceToCredit;

export const getPatchedInvoice: Selector<?Invoice, void> = (state: InvoiceState): ?Invoice =>
  state.invoice.patchedInvoice;
