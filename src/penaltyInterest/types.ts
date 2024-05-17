import type { Action } from "src/types";
import type { InvoiceId } from "src/invoices/types";
export type PenaltyInterestState = {
  byInvoice: Record<string, any>;
  isFetchingByInvoice: Record<string, any>;
};
export type FetchPenaltyInterestByInvoiceAction = Action<"mvj/penaltyInterest/FETCH_BY_INVOICE", InvoiceId>;
export type ReceivePenaltyInterestByInvoiceAction = Action<"mvj/penaltyInterest/RECEIVE_BY_INVOICE", Record<string, any>>;
export type PenaltyInterestNotFoundByInvoiceAction = Action<"mvj/penaltyInterest/NOT_FOUND_BY_INVOICE", InvoiceId>;