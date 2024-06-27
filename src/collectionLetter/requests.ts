import callApi from "/src/api/callApi";
import callUploadRequest from "/src/api/callUploadRequest";
import createUrl from "/src/api/createUrl";
import type { CollectionLetterId, UploadCollectionLetterPayload } from "./types";
import type { LeaseId } from "/src/leases/types";
export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('collection_letter/'), {
    method: 'OPTIONS'
  }));
};
export const fetchCollectionLettersByLease = (lease: LeaseId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`collection_letter/?lease=${lease}&limit=10000`)));
};
export const uploadCollectionLetter = (data: UploadCollectionLetterPayload): Generator<any, any, any> => {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('data', JSON.stringify(data.data));
  const body = formData;
  return callUploadRequest(new Request(createUrl('collection_letter/'), {
    method: 'POST',
    body
  }));
};
export const deleteCollectionLetter = (id: CollectionLetterId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`collection_letter/${id}/`), {
    method: 'DELETE'
  }));
};