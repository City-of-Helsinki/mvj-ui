import type { Action } from "../types";
export type SapInvoicesState = {
  isFetching: boolean;
  list: SapInvoiceList;
};
export type SapInvoiceList = Record<string, any>;
export type FetchSapInvoicesAction = Action<"mvj/sapInvoice/FETCH_ALL", Record<string, any> | null | undefined>;
export type ReceiveSapInvoicesAction = Action<"mvj/sapInvoice/RECEIVE_ALL", SapInvoiceList>;
export type NotFoundAction = Action<"mvj/sapInvoice/NOT_FOUND", void>;