// @flow
import {createAction} from 'redux-actions';

import type {
  CreateCollectionNotePayload,
  DeleteCollectionNotePayload,
  FetchCollectionNotesByLeaseAction,
  ReceiveCollectionNotesByLeaseAction,
  CollectionNotesNotFoundByLeaseAction,
  CreateCollectionNoteAction,
  DeleteCollectionNoteAction,
} from './types';
import type {LeaseId} from '../leases/types';

export const fetchCollectionNotesByLease = (lease: LeaseId):FetchCollectionNotesByLeaseAction =>
  createAction('mvj/collectionNote/FETCH_BY_LEASE')(lease);

export const receiveCollectionNotesByLease = (payload: Object):ReceiveCollectionNotesByLeaseAction =>
  createAction('mvj/collectionNote/RECEIVE_BY_LEASE')(payload);

export const notFoundByLease = (lease: LeaseId):CollectionNotesNotFoundByLeaseAction =>
  createAction('mvj/collectionNote/NOT_FOUND_BY_LEASE')(lease);

export const createCollectionNote = (payload: CreateCollectionNotePayload): CreateCollectionNoteAction =>
  createAction('mvj/collectionNote/CREATE')(payload);

export const deleteCollectionNote = (payload: DeleteCollectionNotePayload): DeleteCollectionNoteAction =>
  createAction('mvj/collectionNote/DELETE')(payload);
