import callApi from "/src/api/callApi";
import createUrl from "/src/api/createUrl";
export const fetchAuditLog = (params: Record<string, any>): Generator<any, any, any> => {
  return callApi(new Request(createUrl('auditlog/', params)));
};