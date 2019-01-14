// @flow
import type {Attributes, Methods, Selector} from '$src/types';
import type {LeaseId} from '$src/leases/types';
import type {RootState} from '$src/root/types';

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.collectionCourtDecision.attributes;

export const getMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.collectionCourtDecision.methods;

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.collectionCourtDecision.isFetchingAttributes;

export const getCollectionCourtDecisionsByLease: Selector<boolean, LeaseId> = (state: RootState, lease: LeaseId): boolean =>
  state.collectionCourtDecision.byLease[lease];

export const getIsFetchingByLease: Selector<boolean, LeaseId> = (state: RootState, lease: LeaseId): boolean =>
  state.collectionCourtDecision.isFetchingByLease[lease];
