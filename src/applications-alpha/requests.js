// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {ApplicationId, Application} from './types';

export const fetchApplications = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('application/')));
};

export const fetchSingleApplication = (id: ApplicationId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`application/${id}`)));
};

export const createApplication = (application: Application): Generator<any, any, any> => {
  const body = JSON.stringify(application);

  return callApi(new Request(createUrl(`application/`), {
    method: 'POST',
    body,
  }));
};

export const editApplication = (application: Application): Generator<any, any, any> => {
  const {id} = application;
  const body = JSON.stringify(application);

  return callApi(new Request(createUrl(`application/${id}`), {
    method: 'PUT',
    body,
  }));
};
