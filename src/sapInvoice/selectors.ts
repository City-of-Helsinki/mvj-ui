import type { Selector } from "types";
import type { SapInvoiceList } from "sapInvoice/types";
import type { RootState } from "root/types";
export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean => state.sapInvoice.isFetching;
export const getSapInvoices: Selector<SapInvoiceList, void> = (state: RootState): SapInvoiceList => state.sapInvoice.list;