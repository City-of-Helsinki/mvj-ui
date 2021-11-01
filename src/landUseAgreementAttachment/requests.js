// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import callUploadRequest from '$src/api/callUploadRequest';

import type {CreateLandUseAgreementAttachmentPayload} from './types';

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`land_use_agreement_attachment/`), {method: 'OPTIONS'}));
};

export const createLandUseAgreementAttachment = (data: CreateLandUseAgreementAttachmentPayload): Generator<any, any, any> => {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('data', JSON.stringify(data.data));

  const body = formData;
  return callUploadRequest(new Request(createUrl('land_use_agreement_attachment/'), {
    method: 'POST',
    body,
  }));
};

export const deleteLandUseAgreementAttachment = (fileId: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`land_use_agreement_attachment/${fileId}/`), {
    method: 'DELETE',
  }));
};
