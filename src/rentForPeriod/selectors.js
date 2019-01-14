// @flow
import type {Attributes, Methods, Selector} from '$src/types';
import type {RootState} from '../root/types';
import type {RentForPeriod} from './types';

import type {LeaseId} from '$src/leases/types';

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.rentForPeriod.isFetchingAttributes;

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.rentForPeriod.attributes;

export const getMethods: Selector<Attributes, void> = (state: RootState): Methods =>
  state.rentForPeriod.methods;

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.rentForPeriod.isFetching;

export const getRentForPeriodArrayByLease: Selector<RentForPeriod, LeaseId> = (state: RootState, leaseId: LeaseId): RentForPeriod => {
  return state.rentForPeriod.byLease[leaseId];
};

export const getIsSaveClicked: Selector<boolean, void> = (state: RootState): boolean =>
  state.rentForPeriod.isSaveClicked;
