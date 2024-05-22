import type { Action } from "src/types";
import type { InvoiceId } from "src/invoices/types";
export type PenaltyInterestState = {
  byInvoice: Record<string, any>;
  isFetchingByInvoice: Record<string, any>;
};
export type FetchPenaltyInterestByInvoiceAction = Action<string, InvoiceId>;
export type ReceivePenaltyInterestByInvoiceAction = Action<string, Record<string, any>>;
export type PenaltyInterestNotFoundByInvoiceAction = Action<string, InvoiceId>;