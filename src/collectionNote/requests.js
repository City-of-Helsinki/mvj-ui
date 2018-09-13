// @flow
import callApi from '$src/api/callApi';
import createUrl from '$src/api/createUrl';

import type {CollectionNoteId} from './types';
import type {LeaseId} from '$src/leases/types';

export const fetchCollectionNotesByLease = (lease: LeaseId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`collection_note/?lease=${lease}&limit=10000/`)));
};

export const createCollectionNote = (note: string): Generator<any, any, any> => {
  const body = JSON.stringify(note);

  return callApi(new Request(createUrl(`collection_note/`), {
    method: 'POST',
    body,
  }));
};

export const deleteCollectionNote = (id: CollectionNoteId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`collection_note/${id}/`), {
    method: 'DELETE',
  }));
};
