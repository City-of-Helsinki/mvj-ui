// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

export const fetchDecisions = (search: string) => {
  return callApi(new Request(createUrl(`decision/${search || ''}`)));
};
