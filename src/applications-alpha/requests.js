// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {ApplicationId, Application} from './types';

export const fetchApplications = () => {
  return callApi(new Request(createUrl('application/')));
};

export const fetchSingleApplication = (id: ApplicationId): Generator<> => {
  return callApi(new Request(createUrl(`application/${id}`)));
};

export const createApplication = (application: Application): Generator<> => {
  const body = JSON.stringify(application);

  return callApi(new Request(createUrl(`application/`), {
    method: 'POST',
    body,
  }));
};

export const editApplication = (application: Application): Generator<> => {
  const {id} = application;
  const body = JSON.stringify(application);

  return callApi(new Request(createUrl(`application/${id}`), {
    method: 'PUT',
    body,
  }));
};
