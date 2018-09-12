// @flow
import callApi from '$src/api/callApi';
import callUploadRequest from '$src/api/callUploadRequest';
import createUrl from '$src/api/createUrl';

import type {CollectionLetterFileData, CollectionLetterId} from './types';
import type {LeaseId} from '$src/leases/types';

export const fetchCollectionLettersByLease = (lease: LeaseId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`collection_letter/?lease=${lease}&limit=10000/`)));
};

export const uploadCollectionLetterFile = (data: CollectionLetterFileData): Generator<any, any, any> => {
  const formData = new FormData();
  formData.set('file', data.file);
  formData.set('data', JSON.stringify(data.data));

  const body = formData;
  return callUploadRequest(new Request(createUrl('collection_letter/'), {
    method: 'POST',
    body,
  }));
};

export const deleteCollectionLetterFile = (id: CollectionLetterId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`collection_letter/${id}/`), {
    method: 'DELETE',
  }));
};
