// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

export const fetchUsers = () => {
  return callApi(new Request(createUrl('user/')));
};
