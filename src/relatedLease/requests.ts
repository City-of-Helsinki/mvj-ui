import callApi from "@/api/callApi";
import createUrl from "@/api/createUrl";
import type { CreateRelatedLeasePayload, CreateRelatedPlotApplicationPayload } from "./types";
export const createRelatedLease = (payload: CreateRelatedLeasePayload): Generator<any, any, any> => {
  const body = JSON.stringify(payload);
  return callApi(new Request(createUrl(`related_lease/`), {
    method: 'POST',
    body
  }));
};
export const deleteReleatedLease = (id: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`related_lease/${id}/`), {
    method: 'DELETE'
  }));
};
export const createRelatedPlotApplication = (payload: CreateRelatedPlotApplicationPayload): Generator<any, any, any> => {
  const body = JSON.stringify(payload);
  return callApi(new Request(createUrl(`related_plot_applications/`), {
    method: 'POST',
    body
  }));
};
export const deleteRelatedPlotApplication = (id: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`related_plot_applications/${id}/`), {
    method: 'DELETE'
  }));
};