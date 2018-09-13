// @flow
import type {Selector} from '../types';
import type {LeaseId} from '$src/leases/types';
import type {RootState} from '$src/root/types';

export const getCollectionCourtDecisionsByLease: Selector<boolean, LeaseId> = (state: RootState, lease: LeaseId): boolean =>
  state.collectionCourtDecision.byLease[lease];

export const getIsFetchingByLease: Selector<boolean, LeaseId> = (state: RootState, lease: LeaseId): boolean =>
  state.collectionCourtDecision.isFetchingByLease[lease];
