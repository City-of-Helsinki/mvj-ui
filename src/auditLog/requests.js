// @flow
import callApi from '$src/api/callApi';
import createUrl from '$src/api/createUrl';

export const fetchAuditLog = (params: Object): Generator<any, any, any> => {
  return callApi(new Request(createUrl('auditlog/', params)));
};
