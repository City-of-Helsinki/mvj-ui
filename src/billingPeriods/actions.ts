import { createAction } from "redux-actions";
import type { FetchBillingPeriodsPayload, FetchBillingPeriodsAction, ReceiveBillingPeriodsAction, BillingPeriodsNotFoundAction } from "./types";
export const fetchBillingPeriodsByLease = (payload: FetchBillingPeriodsPayload): FetchBillingPeriodsAction => createAction('mvj/billingperiods/FETCH_ALL')(payload);
export const receiveBillingPeriodsByLease = (billingPeriods: Record<string, any>): ReceiveBillingPeriodsAction => createAction('mvj/billingperiods/RECEIVE_ALL')(billingPeriods);
export const notFound = (): BillingPeriodsNotFoundAction => createAction('mvj/billingperiods/NOT_FOUND')();