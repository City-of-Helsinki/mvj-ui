import callApi from "../api/callApi";
import createUrl from "../api/createUrl";
export const fetchUsers = (search: string): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`user/${search || ''}`)));
};