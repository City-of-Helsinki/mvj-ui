// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import callUploadRequest from '$src/api/callUploadRequest';

import type {InfillDevelopment, InfillDevelopmentId, InfillDevelopmentFileData} from './types';

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`infill_development_compensation/`), {method: 'OPTIONS'}));
};

export const fetchInfillDevelopments = (search: string): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`infill_development_compensation/${search || ''}`)));
};

export const fetchSingleInfillDevelopment = (id: InfillDevelopmentId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`infill_development_compensation/${id}/`)));
};

export const createInfillDevelopment = (infillDevelopment: InfillDevelopment): Generator<any, any, any> => {
  const body = JSON.stringify(infillDevelopment);

  return callApi(new Request(createUrl('infill_development_compensation/'), {
    method: 'POST',
    body,
  }));
};

export const editInfillDevelopment = (infillDevelopment: InfillDevelopment): Generator<any, any, any> => {
  const {id} = infillDevelopment;
  const body = JSON.stringify(infillDevelopment);

  return callApi(new Request(createUrl(`infill_development_compensation/${id}/`), {
    method: 'PATCH',
    body,
  }));
};

export const uploadInfillDevelopmentFile = (data: InfillDevelopmentFileData): Generator<any, any, any> => {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('data', JSON.stringify(data.data));

  const body = formData;
  return callUploadRequest(new Request(createUrl('infill_development_compensation_attachment/'), {
    method: 'POST',
    body,
  }));
};

export const deleteInfillDevelopmentFile = (fileId: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`infill_development_compensation_attachment/${fileId}/`), {method: 'DELETE'}));
};
