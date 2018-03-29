// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

export const fetchUsers = (search: string): Generator<> => {
  return callApi(new Request(createUrl(`user/${search || ''}`)));
};
