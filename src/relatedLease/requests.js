// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {CreateRelatedLeasePayload} from './types';

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`related_lease/`), {
    method: 'OPTIONS',
  }));
};

export const createRelatedLease = (payload: CreateRelatedLeasePayload): Generator<any, any, any> => {
  const body = JSON.stringify(payload);

  return callApi(new Request(createUrl(`related_lease/`), {
    method: 'POST',
    body,
  }));
};

export const deleteReleatedLease = (id: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`related_lease/${id}/`), {
    method: 'DELETE',
  }));
};
