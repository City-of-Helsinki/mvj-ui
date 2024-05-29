import { createAction } from "redux-actions";
import type { InvoiceId } from "invoices/types";
import type { FetchPenaltyInterestByInvoiceAction, ReceivePenaltyInterestByInvoiceAction, PenaltyInterestNotFoundByInvoiceAction } from "./types";
export const fetchPenaltyInterestByInvoice = (invoiceId: InvoiceId): FetchPenaltyInterestByInvoiceAction => createAction('mvj/penaltyInterest/FETCH_BY_INVOICE')(invoiceId);
export const receivePenaltyInterestByInvoice = (penaltyInterest: Record<string, any>): ReceivePenaltyInterestByInvoiceAction => createAction('mvj/penaltyInterest/RECEIVE_BY_INVOICE')(penaltyInterest);
export const penaltyInterestNotFoundByInvoice = (invoiceId: InvoiceId): PenaltyInterestNotFoundByInvoiceAction => createAction('mvj/penaltyInterest/NOT_FOUND_BY_INVOICE')(invoiceId);