import { createAction } from "redux-actions";
import type { SapInvoiceList, FetchSapInvoicesAction, ReceiveSapInvoicesAction, NotFoundAction } from "src/sapInvoice/types";
export const fetchSapInvoices = (query?: Record<string, any>): FetchSapInvoicesAction => createAction('mvj/sapInvoice/FETCH_ALL')(query);
export const receiveSapInvoices = (invoices: SapInvoiceList): ReceiveSapInvoicesAction => createAction('mvj/sapInvoice/RECEIVE_ALL')(invoices);
export const notFound = (): NotFoundAction => createAction('mvj/sapInvoice/NOT_FOUND')();