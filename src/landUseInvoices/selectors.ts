import get from "lodash/get";
import type { Attributes, Methods, Selector } from "types";
import type { RootState } from "@/root/types";
import type { Invoice, InvoiceList } from "./types";
export type LandUseContractId = number;
export const getIsFetching: Selector<boolean, void> = (
  state: RootState,
): boolean => state.landUseInvoice.isFetching;
export const getIsSaving: Selector<boolean, void> = (
  state: RootState,
): boolean => state.landUseInvoice.isSaving;
export const getIsCreateInvoicePanelOpen: Selector<boolean, void> = (
  state: RootState,
): boolean => state.landUseInvoice.isCreatePanelOpen;
export const getIsCreditInvoicePanelOpen: Selector<boolean, void> = (
  state: RootState,
): boolean => state.landUseInvoice.isCreditPanelOpen;
export const getIsCreateClicked: Selector<boolean, void> = (
  state: RootState,
): boolean => state.landUseInvoice.isCreateClicked;
export const getIsCreditClicked: Selector<boolean, void> = (
  state: RootState,
): boolean => state.landUseInvoice.isCreditClicked;
export const getIsEditClicked: Selector<boolean, void> = (
  state: RootState,
): boolean => state.landUseInvoice.isEditClicked;
export const getAttributes: Selector<Attributes, void> = (
  state: RootState,
): Attributes => state.landUseInvoice.attributes;
export const getMethods: Selector<Methods, void> = (
  state: RootState,
): Methods => state.landUseInvoice.methods;
export const getIsFetchingAttributes: Selector<boolean, void> = (
  state: RootState,
): boolean => state.landUseInvoice.isFetchingAttributes;
export const getInvoicesByLandUseContractId: Selector<
  InvoiceList,
  LandUseContractId
> = (state: RootState, landUseContractId: LandUseContractId): InvoiceList =>
  state.landUseInvoice.byLandUseContract[landUseContractId];
export const getInvoiceToCredit: Selector<string | null | undefined, void> = (
  state: RootState,
): string | null | undefined => state.landUseInvoice.invoiceToCredit;
export const getPatchedInvoice: Selector<Invoice | null | undefined, void> = (
  state: RootState,
): Invoice | null | undefined => state.landUseInvoice.patchedInvoice;
export const getCollapseStateByKey: Selector<
  Record<string, any> | null | undefined,
  string
> = (state: RootState, key: string): Record<string, any> | null | undefined => {
  return get(state.landUseInvoice.collapseStates, key);
};
