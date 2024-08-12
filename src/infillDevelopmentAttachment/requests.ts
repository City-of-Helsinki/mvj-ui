import callApi from "@/api/callApi";
import createUrl from "@/api/createUrl";
import callUploadRequest from "@/api/callUploadRequest";
import type { CreateInfillDevelopmentAttachmentPayload } from "./types";
export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`infill_development_compensation_attachment/`), {
    method: 'OPTIONS'
  }));
};
export const createInfillDevelopmentAttachment = (data: CreateInfillDevelopmentAttachmentPayload): Generator<any, any, any> => {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('data', JSON.stringify(data.data));
  const body = formData;
  return callUploadRequest(new Request(createUrl('infill_development_compensation_attachment/'), {
    method: 'POST',
    body
  }));
};
export const deleteInfillDevelopmentAttachment = (fileId: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`infill_development_compensation_attachment/${fileId}/`), {
    method: 'DELETE'
  }));
};