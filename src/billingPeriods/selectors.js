// @flow
import type {Selector} from '../types';
import type {BillingPeriodListMap, BillingPeriodsState} from './types';
import type {LeaseId} from '$src/leases/types';

export const getIsFetching: Selector<boolean, void> = (state: BillingPeriodsState): boolean =>
  state.billingPeriods.isFetching;

export const getBillingPeriodsByLease: Selector<BillingPeriodListMap, LeaseId> = (state: BillingPeriodsState, leaseId: LeaseId): BillingPeriodListMap => {
  return state.billingPeriods.byLease[leaseId];
};
