import callApi from "@/api/callApi";
import createUrl from "@/api/createUrl";
import { store } from "@/index";
import { getCurrentLease } from '@/leases/selectors';
export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease_create_charge/`), {
    method: 'OPTIONS'
  }));
};
export const fetchReceivableTypes = (nextUrl: string): Generator<any, any, any> => {
  const state = store.getState();
  const lease = getCurrentLease(state);
  const serviceUnit = lease.service_unit;
  if (nextUrl) {
    return callApi(new Request(nextUrl, {
      method: 'GET'
    }));
  }
  return callApi(new Request(createUrl(`receivable_type/`, {
    service_unit: serviceUnit.id
  }), {
    method: 'GET'
  }));
};