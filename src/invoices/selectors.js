// @flow
import type {Attributes, Methods, Selector} from '$src/types';
import type {RootState} from '$src/root/types';
import type {Invoice, InvoiceList} from './types';
import type {LeaseId} from '$src/leases/types';

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.invoice.isFetching;

export const getIsCreateInvoicePanelOpen: Selector<boolean, void> = (state: RootState): boolean =>
  state.invoice.isCreatePanelOpen;

export const getIsCreditInvoicePanelOpen: Selector<boolean, void> = (state: RootState): boolean =>
  state.invoice.isCreditPanelOpen;

export const getIsCreateClicked: Selector<boolean, void> = (state: RootState): boolean =>
  state.invoice.isCreateClicked;

export const getIsCreditClicked: Selector<boolean, void> = (state: RootState): boolean =>
  state.invoice.isCreditClicked;

export const getIsEditClicked: Selector<boolean, void> = (state: RootState): boolean =>
  state.invoice.isEditClicked;

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.invoice.attributes;

export const getMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.invoice.methods;

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.invoice.isFetchingAttributes;

export const getInvoicesByLease: Selector<InvoiceList, LeaseId> = (state: RootState, leaseId: LeaseId): InvoiceList =>
  state.invoice.byLease[leaseId];

export const getInvoiceToCredit: Selector<?string, void> = (state: RootState): ?string =>
  state.invoice.invoiceToCredit;

export const getPatchedInvoice: Selector<?Invoice, void> = (state: RootState): ?Invoice =>
  state.invoice.patchedInvoice;
