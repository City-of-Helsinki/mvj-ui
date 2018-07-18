// @flow
import {call, put, select} from 'redux-saga/effects';
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import {getApiToken} from '$src/auth/selectors';
import {receiveError} from '$src/api/actions';

import type {InfillDevelopment, InfillDevelopmentId, InfillDevelopmentFileData} from './types';

function* callUploadRequest(request: Request): Generator<any, any, any> {
  const apiToken = yield select(getApiToken);
  if (apiToken) {
    request.headers.set('Authorization', `Bearer ${apiToken}`);
  }

  const response = yield call(fetch, request);
  const status = response.status;
  const bodyAsJson = yield call([response, response.json]);

  if (status === 500) {
    yield put(receiveError(bodyAsJson));
  }

  return {response, bodyAsJson};
}

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`infill_development_compensation/`), {method: 'OPTIONS'}));
};

export const fetchInfillDevelopments = (search: string): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`infill_development_compensation/${search || ''}`)));
};

export const fetchSingleInfillDevelopment = (id: InfillDevelopmentId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`infill_development_compensation/${id}/`)));
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
  formData.set('file', data.file);
  formData.set('data', JSON.stringify(data.data));

  const body = formData;
  return callUploadRequest(new Request(createUrl('infill_development_compensation_attachment/'), {
    method: 'POST',
    body,
  }));
};

export const deleteInfillDevelopmentFile = (fileId: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`infill_development_compensation_attachment/${fileId}/`), {method: 'DELETE'}));
};
