// @flow
import type {Action} from '../types';
import type {LeaseId} from '$src/leases/types';

export type BillingPeriodsState = Object;
export type BillingPeriodsOptions = {
  leaseId: LeaseId,
  year: number,
}
export type BillingPeriodList = Array<Object>;
export type BillingPeriodListMap = Object;

export type FetchBillingPeriodsAction = Action<'mvj/billingperiods/FETCH_ALL', BillingPeriodsOptions>;
export type ReceiveBillingPeriodsAction = Action<'mvj/billingperiods/RECEIVE_ALL', BillingPeriodListMap>;
export type BillingPeriodsNotFoundAction = Action<'mvj/billingperiods/NOT_FOUND', void>;
