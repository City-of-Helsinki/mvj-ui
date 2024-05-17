import callApi from "../api/callApi";
import createUrl from "../api/createUrl";
import callUploadRequest from "src/api/callUploadRequest";
import type { CreateLeaseAreaAttachmentPayload } from "./types";
export const createLeaseAreaAttachment = (payload: CreateLeaseAreaAttachmentPayload): Generator<any, any, any> => {
  const formData = new FormData();
  formData.append('file', payload.file);
  formData.append('data', JSON.stringify(payload.data));
  const body = formData;
  return callUploadRequest(new Request(createUrl('lease_area_attachment/'), {
    method: 'POST',
    body
  }));
};
export const deleteLeaseAreaAttachment = (id: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease_area_attachment/${id}/`), {
    method: 'DELETE'
  }));
};