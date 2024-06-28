import type { Selector } from "types";
import type { PreviewInvoices } from "./types";
import type { RootState } from "/src/root/types";
export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean => state.previewInvoices.isFetching;
export const getPreviewInvoices: Selector<PreviewInvoices, void> = (state: RootState): PreviewInvoices => state.previewInvoices.list;