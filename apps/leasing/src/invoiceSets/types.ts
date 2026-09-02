import type { LeaseId } from "@/leases/types";

export type InvoiceSetState = {
  byLease: InvoiceSetListMap;
  isFetching: boolean;
};
export type InvoiceSetList = Array<Record<string, any>>;
export type InvoiceSetListMap = Record<number, InvoiceSetList>;
export type InvoiceSetPayload = {
  creditData: Record<string, any>;
  invoiceSetId: number;
  lease: LeaseId;
};
