import callApi from "@/api/callApi";
import createUrl from "@/api/createUrl";
import callUploadRequest from "@/api/callUploadRequest";
import type { CreateLeaseInspectionAttachmentPayload } from "./types";
export const createLeaseInspectionAttachment = (payload: CreateLeaseInspectionAttachmentPayload): Generator<any, any, any> => {
  const formData = new FormData();
  formData.append('file', payload.file);
  formData.append('data', JSON.stringify(payload.data));
  const body = formData;
  return callUploadRequest(new Request(createUrl('inspection_attachment/'), {
    method: 'POST',
    body
  }));
};
export const deleteLeaseInspectionAttachment = (id: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`inspection_attachment/${id}/`), {
    method: 'DELETE'
  }));
};