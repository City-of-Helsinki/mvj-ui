import type { Attributes, Methods, Selector } from "types";
import type { RootState } from "@/root/types";
import type { Invoice, InvoiceList } from "./types";
import type { LeaseId } from "@/leases/types";
export const getIsFetching: Selector<boolean, void> = (
  state: RootState,
): boolean => state.invoice.isFetching;
export const getIsSaving: Selector<boolean, void> = (
  state: RootState,
): boolean => state.invoice.isSaving;
export const getIsCreateInvoicePanelOpen: Selector<boolean, void> = (
  state: RootState,
): boolean => state.invoice.isCreatePanelOpen;
export const getIsCreditInvoicePanelOpen: Selector<boolean, void> = (
  state: RootState,
): boolean => state.invoice.isCreditPanelOpen;
export const getIsCreateClicked: Selector<boolean, void> = (
  state: RootState,
): boolean => state.invoice.isCreateClicked;
export const getIsCreditClicked: Selector<boolean, void> = (
  state: RootState,
): boolean => state.invoice.isCreditClicked;
export const getIsEditClicked: Selector<boolean, void> = (
  state: RootState,
): boolean => state.invoice.isEditClicked;
export const getAttributes: Selector<Attributes, void> = (
  state: RootState,
): Attributes => state.invoice.attributes;
export const getMethods: Selector<Methods, void> = (
  state: RootState,
): Methods => state.invoice.methods;
export const getIsFetchingAttributes: Selector<boolean, void> = (
  state: RootState,
): boolean => state.invoice.isFetchingAttributes;
export const getInvoicesByLease: Selector<InvoiceList, LeaseId> = (
  state: RootState,
  leaseId: LeaseId,
): InvoiceList => state.invoice.byLease[leaseId];
export const getInvoiceToCredit: Selector<string | null | undefined, void> = (
  state: RootState,
): string | null | undefined => state.invoice.invoiceToCredit;
export const getPatchedInvoice: Selector<Invoice | null | undefined, void> = (
  state: RootState,
): Invoice | null | undefined => state.invoice.patchedInvoice;
