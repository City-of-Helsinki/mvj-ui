import type { Selector } from "types";
import type { RootState } from "@/root/types";
import type { InvoiceId } from "@/invoices/types";
export const getPenaltyInterestByInvoice: Selector<
  Record<string, any>,
  InvoiceId
> = (state: RootState, id: InvoiceId): Record<string, any> =>
  state.penaltyInterest.byInvoice[id];
export const getIsFetchingByInvoice: Selector<boolean, InvoiceId> = (
  state: RootState,
  id: InvoiceId,
): boolean => state.penaltyInterest.isFetchingByInvoice[id];
