import type { Action } from "@/types";
export type SapInvoicesState = {
  isFetching: boolean;
  list: SapInvoiceList;
};
export type SapInvoiceList = {
  count: number;
  next: string;
  previous: string;
  results: Record<string, any>[];
};
export type FetchSapInvoicesAction = Action<
  string,
  Record<string, any> | null | undefined
>;
export type ReceiveSapInvoicesAction = Action<string, SapInvoiceList>;
export type NotFoundAction = Action<string, void>;
