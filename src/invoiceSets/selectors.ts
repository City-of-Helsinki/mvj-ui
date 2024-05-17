import type { Selector } from "src/types";
import type { RootState } from "src/root/types";
import type { InvoiceSetList } from "./types";
import type { LeaseId } from "src/leases/types";
export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean => state.invoiceSet.isFetching;
export const getInvoiceSetsByLease: Selector<InvoiceSetList, LeaseId> = (state: RootState, leaseId: LeaseId): InvoiceSetList => {
  return state.invoiceSet.byLease[leaseId];
};