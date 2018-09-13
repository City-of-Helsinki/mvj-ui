// @flow
import type {Selector} from '../types';
import type {LeaseId} from '$src/leases/types';
import type {RootState} from '$src/root/types';

export const getCollectionLettersByLease: Selector<boolean, LeaseId> = (state: RootState, lease: LeaseId): boolean =>
  state.collectionLetter.byLease[lease];

export const getIsFetchingByLease: Selector<boolean, LeaseId> = (state: RootState, lease: LeaseId): boolean =>
  state.collectionLetter.isFetchingByLease[lease];
