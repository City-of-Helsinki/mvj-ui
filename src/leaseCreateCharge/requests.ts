import callApi from "../api/callApi";
import createUrl from "../api/createUrl";
import { store } from "../root/startApp";
import { getUserActiveServiceUnit } from "../usersPermissions/selectors";
export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease_create_charge/`), {
    method: 'OPTIONS'
  }));
};
export const fetchReceivableTypes = (): Generator<any, any, any> => {
  const state = store.getState();
  const serviceUnit = getUserActiveServiceUnit(state);
  return callApi(new Request(createUrl(`receivable_type/`, {
    service_unit: serviceUnit.id
  }), {
    method: 'GET'
  }));
};