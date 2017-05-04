// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {ApplicationId} from './types';

export const fetchApplications = () => {
  return callApi(new Request(createUrl('applications/')));
};

export const fetchSingleApplication = (id: ApplicationId): Generator<> => {
  return callApi(new Request(createUrl(`applications/${id}`)));
};
