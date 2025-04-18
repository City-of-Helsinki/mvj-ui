import callApi from "@/api/callApi";
import createUrl from "@/api/createUrl";
import callUploadRequest from "@/api/callUploadRequest";
import { UploadFileData } from "./types";
export const fetchAttributesRequest = (): Generator<any, any, any> => {
  return callApi(
    new Request(createUrl("answer/"), {
      method: "OPTIONS",
    }),
  );
};
export const fetchApplicantInfoCheckAttributesRequest = (): Generator<
  any,
  any,
  any
> => {
  return callApi(
    new Request(createUrl("information_check/"), {
      method: "OPTIONS",
    }),
  );
};
export const fetchSingleApplicationAttachments = (
  id: number,
): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`answer/${id}/attachments/`)));
};
export const createApplicationRequest = (
  payload: Record<string, any>,
): Generator<any, any, any> => {
  return callApi(
    new Request(createUrl(`answer/`), {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  );
};
export const editApplicationRequest = (
  id: number,
  payload: Record<string, any>,
): Generator<any, any, any> => {
  return callApi(
    new Request(createUrl(`answer/${id}/`), {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  );
};
// TODO: Why is id hardcoded?
export const fetchFormAttributesRequest = (
  id?: number,
): Generator<any, any, any> => {
  return callApi(
    new Request(createUrl(`form/1/`), {
      method: "OPTIONS",
    }),
  );
};
export const fetchAttachmentAttributesRequest = (): Generator<
  any,
  any,
  any
> => {
  return callApi(
    new Request(createUrl("attachment/"), {
      method: "OPTIONS",
    }),
  );
};
export const uploadFileRequest = (
  fileData: UploadFileData,
): Generator<any, any, any> => {
  const { field, file, answer } = fileData;
  const formData = new FormData();
  formData.append("field", field.toString());
  formData.append("name", file.name);
  formData.append("attachment", file);

  if (answer) {
    formData.append("answer", answer.toString());
  }

  return callUploadRequest(
    new Request(createUrl("attachment/"), {
      method: "POST",
      body: formData,
    }),
  );
};
export const fetchPendingUploadsRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl("attachment/")));
};
export const deleteUploadRequest = (id: number): Generator<any, any, any> => {
  return callApi(
    new Request(createUrl(`attachment/${id}/`), {
      method: "DELETE",
    }),
  );
};
