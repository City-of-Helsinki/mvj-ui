// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

export const fetchContacts = (search: string) => {
  return callApi(new Request(createUrl(`contact/${search}`)));
};
