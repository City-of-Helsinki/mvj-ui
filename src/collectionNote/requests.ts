import callApi from "@/api/callApi";
import createUrl from "@/api/createUrl";
import type { CollectionNoteId } from "./types";
import type { LeaseId } from "@/leases/types";
export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('collection_note/'), {
    method: 'OPTIONS'
  }));
};
export const fetchCollectionNotesByLease = (lease: LeaseId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`collection_note/?lease=${lease}&limit=10000`)));
};
export const createCollectionNote = (note: string): Generator<any, any, any> => {
  const body = JSON.stringify(note);
  return callApi(new Request(createUrl(`collection_note/`), {
    method: 'POST',
    body
  }));
};
export const deleteCollectionNote = (id: CollectionNoteId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`collection_note/${id}/`), {
    method: 'DELETE'
  }));
};