import callApi from "../api/callApi";
import createUrl from "../api/createUrl";
export const fetchUsersPermissions = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('users_permissions/')));
};