// @flow
import type {Selector} from '$src/types';
import type {RootState} from '$src/root/types';
import type {LeaseId} from '$src/leases/types';

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.billingPeriod.isFetching;

export const getBillingPeriodsByLease: Selector<Object, LeaseId> = (state: RootState, leaseId: LeaseId): Object => {
  return state.billingPeriod.byLease[leaseId];
};
