import callApi from "@/api/callApi";
import createUrl from "@/api/createUrl";
import type { CollectionNoteId, CollectionNotePayload } from "./types";
import type { LeaseId } from "@/leases/types";
export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(
    new Request(createUrl("collection_note/"), {
      method: "OPTIONS",
    }),
  );
};
export const fetchCollectionNotesByLease = (
  lease: LeaseId,
): Generator<any, any, any> => {
  return callApi(
    new Request(createUrl(`collection_note/?lease=${lease}&limit=10000`)),
  );
};
export const createCollectionNote = (
  payload: CollectionNotePayload,
): Generator<any, any, any> => {
  const body = JSON.stringify(payload);
  return callApi(
    new Request(createUrl(`collection_note/`), {
      method: "POST",
      body,
    }),
  );
};
export const deleteCollectionNote = (
  id: CollectionNoteId,
): Generator<any, any, any> => {
  return callApi(
    new Request(createUrl(`collection_note/${id}/`), {
      method: "DELETE",
    }),
  );
};

export const patchCollectionNote = (
  payload: CollectionNotePayload,
): Generator<any, any, any> => {
  const { id, ...data } = payload;
  const body = JSON.stringify(data);
  return callApi(
    new Request(createUrl(`collection_note/${id}/`), {
      method: "PATCH",
      body,
    }),
  );
};
