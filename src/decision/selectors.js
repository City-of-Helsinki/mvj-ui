// @flow
import type {Selector} from '../types';
import type {
  DecisionList,
  DecisionState,
} from './types';
import type {LeaseId} from '$src/leases/types';

export const getIsFetching: Selector<boolean, void> = (state: DecisionState): boolean =>
  state.decision.isFetching;

export const getDecisionsByLease: Selector<DecisionList, LeaseId> = (state: DecisionState, leaseId: LeaseId): DecisionList => {
  return state.decision.byLease[leaseId];
};
