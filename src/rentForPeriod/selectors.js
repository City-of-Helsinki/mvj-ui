// @flow
import type {Selector} from '../types';
import type {
  RentForPeriod,
  RentForPeriodState,
} from './types';

import type {LeaseId} from '$src/leases/types';

export const getIsFetching: Selector<boolean, void> = (state: RentForPeriodState): boolean =>
  state.rentForPeriod.isFetching;

export const getRentForPeriodByLease: Selector<RentForPeriod, LeaseId> = (state: RentForPeriodState, leaseId: LeaseId): RentForPeriod => {
  return state.rentForPeriod.byLease[leaseId];
};
