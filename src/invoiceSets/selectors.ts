import type { Selector } from "types";
import type { RootState } from "@/root/types";
import type { InvoiceSetList } from "./types";
import type { LeaseId } from "@/leases/types";
export const getIsFetching: Selector<boolean, void> = (
  state: RootState,
): boolean => state.invoiceSet.isFetching;
export const getInvoiceSetsByLease: Selector<InvoiceSetList, LeaseId> = (
  state: RootState,
  leaseId: LeaseId,
): InvoiceSetList => {
  return state.invoiceSet.byLease[leaseId];
};
