// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

export const fetchNoticePeriods = (search: string) => {
  return callApi(new Request(createUrl(`notice_period/${search || ''}`)));
};
