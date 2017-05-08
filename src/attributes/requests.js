// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

export const fetchAttributes = () => {
  return callApi(new Request(createUrl('application/'), {method: 'OPTIONS'}));
};
