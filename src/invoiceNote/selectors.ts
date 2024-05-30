import type { Attributes, Methods, Selector } from "../types";
import type { RootState } from "root/types";
import type { InvoiceNoteList } from "invoiceNote/types";
export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean => state.invoiceNote.isFetchingAttributes;
export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes => state.invoiceNote.attributes;
export const getMethods: Selector<Methods, void> = (state: RootState): Methods => state.invoiceNote.methods;
export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean => state.invoiceNote.isFetching;
export const getInvoiceNoteList: Selector<InvoiceNoteList, void> = (state: RootState): InvoiceNoteList => state.invoiceNote.list;
export const getIsCreateModalOpen: Selector<boolean, void> = (state: RootState): boolean => state.invoiceNote.isCreateModalOpen;