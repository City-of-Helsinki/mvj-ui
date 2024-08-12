import type { Action } from "@/types";
import type { LeaseId } from "@/leases/types";
export type InvoiceSetState = {
  byLease: InvoiceSetListMap;
  isFetching: boolean;
};
export type InvoiceSetList = Array<Record<string, any>>;
export type InvoiceSetListMap = Record<number, InvoiceSetList>;
export type FetchInvoiceSetsByLeaseAction = Action<string, LeaseId>;
export type ReceiveInvoiceSetsByLeaseAction = Action<string, Record<string, any>>;
export type CreditInvoiceSetAction = Action<string, Record<string, any>>;
export type InvoiceSetsNotFoundAction = Action<string, void>;