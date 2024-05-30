import callApi from "../api/callApi";
import createUrl, { standardStringifyQuery } from "../api/createUrl";
import type { CreateChargePayload, Lease, LeaseId, SendEmailPayload } from "./types";
export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('lease/'), {
    method: 'OPTIONS'
  }));
};
export const fetchLeases = (params: Record<string, any> | null | undefined): Generator<any, any, any> => {
  return callApi(new Request(createUrl('lease/', params)));
};
export const fetchSingleLease = (id: LeaseId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease/${id}/`)));
};
export const createLease = (lease: Lease): Generator<any, any, any> => {
  const body = JSON.stringify(lease);
  return callApi(new Request(createUrl(`lease/`), {
    method: 'POST',
    body
  }));
};
export const deleteLease = (leaseId: LeaseId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease/${leaseId}/`), {
    method: 'DELETE'
  }));
};
export const patchLease = (lease: Lease): Generator<any, any, any> => {
  const {
    id
  } = lease;
  const body = JSON.stringify(lease);
  return callApi(new Request(createUrl(`lease/${id}/`), {
    method: 'PATCH',
    body
  }));
};
export const copyAreasToContract = (leaseId: LeaseId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease_copy_areas_to_contract/?lease=${leaseId}`), {
    method: 'POST'
  }));
};
export const copyDecisionToLeases = (params: Record<string, any>): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`/decision_copy_to_leases/?${standardStringifyQuery(params)}`), {
    method: 'POST'
  }));
};
export const createCharge = (payload: CreateChargePayload): Generator<any, any, any> => {
  const {
    data
  } = payload;
  const body = JSON.stringify(data);
  return callApi(new Request(createUrl(`lease_create_charge/`), {
    method: 'POST',
    body
  }));
};
export const startInvoicing = (leaseId: LeaseId): Generator<any, any, any> => {
  const body = JSON.stringify({
    invoicing_enabled: true
  });
  return callApi(new Request(createUrl(`lease_set_invoicing_state/?lease=${leaseId}`), {
    method: 'POST',
    body
  }));
};
export const stopInvoicing = (leaseId: LeaseId): Generator<any, any, any> => {
  const body = JSON.stringify({
    invoicing_enabled: false
  });
  return callApi(new Request(createUrl(`lease_set_invoicing_state/?lease=${leaseId}`), {
    method: 'POST',
    body
  }));
};
export const setRentInfoComplete = (leaseId: LeaseId): Generator<any, any, any> => {
  const body = JSON.stringify({
    rent_info_complete: true
  });
  return callApi(new Request(createUrl(`lease_set_rent_info_completion_state/?lease=${leaseId}`), {
    method: 'POST',
    body
  }));
};
export const setRentInfoUncomplete = (leaseId: LeaseId): Generator<any, any, any> => {
  const body = JSON.stringify({
    rent_info_complete: false
  });
  return callApi(new Request(createUrl(`lease_set_rent_info_completion_state/?lease=${leaseId}`), {
    method: 'POST',
    body
  }));
};
export const sendEmail = (payload: SendEmailPayload): Generator<any, any, any> => {
  const body = JSON.stringify(payload);
  return callApi(new Request(createUrl('send_email/'), {
    method: 'POST',
    body
  }));
};