import { createAction } from "redux-actions";
import type { LeaseId } from "@/leases/types";
import type { FetchInvoiceSetsByLeaseAction, ReceiveInvoiceSetsByLeaseAction, CreditInvoiceSetAction, InvoiceSetsNotFoundAction } from "./types";
export const fetchInvoiceSetsByLease = (leaseId: LeaseId): FetchInvoiceSetsByLeaseAction => createAction('mvj/invoiceSets/FETCH_BY_LEASE')(leaseId);
export const receiveInvoiceSetsByLease = (payload: Record<string, any>): ReceiveInvoiceSetsByLeaseAction => createAction('mvj/invoiceSets/RECEIVE_BY_LEASE')(payload);
export const creditInvoiceSet = (invoiceset: Record<string, any>): CreditInvoiceSetAction => createAction('mvj/invoiceSets/CREDIT_INVOICESET')(invoiceset);
export const notFound = (): InvoiceSetsNotFoundAction => createAction('mvj/invoiceSets/NOT_FOUND')();