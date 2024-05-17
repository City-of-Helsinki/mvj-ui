import type { Action } from "../types";
import type { LeaseId } from "src/leases/types";
export type InvoiceSetState = {
  byLease: InvoiceSetListMap;
  isFetching: boolean;
};
export type InvoiceSetList = Array<Record<string, any>>;
export type InvoiceSetListMap = Record<number, InvoiceSetList>;
export type FetchInvoiceSetsByLeaseAction = Action<"mvj/invoiceSets/FETCH_BY_LEASE", LeaseId>;
export type ReceiveInvoiceSetsByLeaseAction = Action<"mvj/invoiceSets/RECEIVE_BY_LEASE", Record<string, any>>;
export type CreditInvoiceSetAction = Action<"mvj/invoiceSets/CREDIT_INVOICESET", Record<string, any>>;
export type InvoiceSetsNotFoundAction = Action<"mvj/invoiceSets/NOT_FOUND", void>;