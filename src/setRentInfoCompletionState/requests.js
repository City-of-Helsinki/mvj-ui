// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease_set_rent_info_completion_state/`), {method: 'OPTIONS'}));
};
