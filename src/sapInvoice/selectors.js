// @flow
import type {Selector} from '$src/types';
import type {SapInvoiceList} from '$src/sapInvoice/types';
import type {RootState} from '$src/root/types';

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.sapInvoice.isFetching;

export const getSapInvoices: Selector<SapInvoiceList, void> = (state: RootState): SapInvoiceList =>
  state.sapInvoice.list;
