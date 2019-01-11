// @flow
import type {Attributes, Methods, Selector} from '$src/types';
import type {RootState} from '$src/root/types';
import type {LeaseId} from '$src/leases/types';

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.billingPeriod.isFetching;

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.billingPeriod.isFetchingAttributes;

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.billingPeriod.attributes;

export const getMethods: Selector<Attributes, void> = (state: RootState): Methods =>
  state.billingPeriod.methods;

export const getBillingPeriodsByLease: Selector<Object, LeaseId> = (state: RootState, leaseId: LeaseId): Object => {
  return state.billingPeriod.byLease[leaseId];
};
