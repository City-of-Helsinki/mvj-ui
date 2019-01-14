// @flow
import type {Selector} from '$src/types';
import type {RootState} from '$src/root/types';
import type {DecisionList} from './types';
import type {LeaseId} from '$src/leases/types';

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.decision.isFetching;

export const getDecisionsByLease: Selector<DecisionList, LeaseId> = (state: RootState, leaseId: LeaseId): DecisionList => {
  return state.decision.byLease[leaseId];
};
