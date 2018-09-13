// @flow
import type {Action} from '../types';
import type {LeaseId} from '$src/leases/types';

export type CollectionNoteId = number;
export type CollectionNoteState = {
  byLease: Object,
  isFetchingByLease: Object,
};

export type CreateCollectionNotePayload = {
  lease: LeaseId,
  note: string,
}
export type DeleteCollectionNotePayload = {
  id: CollectionNoteId,
  lease: LeaseId,
}

export type FetchCollectionNotesByLeaseAction = Action<'mvj/collectionNote/FETCH_BY_LEASE', LeaseId>;
export type ReceiveCollectionNotesByLeaseAction = Action<'mvj/collectionNote/RECEIVE_BY_LEASE', Object>;
export type CollectionNotesNotFoundByLeaseAction = Action<'mvj/collectionNote/NOT_FOUND_BY_LEASE', LeaseId>;
export type CreateCollectionNoteAction = Action<'mvj/collectionNote/CREATE', CreateCollectionNotePayload>;
export type DeleteCollectionNoteAction = Action<'mvj/collectionNote/DELETE', DeleteCollectionNotePayload>;
