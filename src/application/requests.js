// @flow
import callApi from '$src/api/callApi';
import createUrl from '$src/api/createUrl';

export const fetchApplicantInfoCheckAttributesRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('information_check/'), {method: 'OPTIONS'}));
};
