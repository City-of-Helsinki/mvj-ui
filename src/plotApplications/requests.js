// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';
import callUploadRequest from "../api/callUploadRequest";

export const fetchPlotApplications = (params: ?Object): Generator<any, any, any> => {
  return callApi(new Request(createUrl('answer/', params)));
};

export const fetchSinglePlotApplication = (id: Number): Generator <any, any, any> => {
  return callApi(new Request(createUrl(`answer/${id}/`)));
};

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('answer/'), {method: 'OPTIONS'}));
};

export const fetchPlotSearchSubtypesRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('plot_search_subtype/')));
};

export const fetchSinglePlotApplicationAttachments = (id: Number): Generator <any, any, any> => {
  return callApi(new Request(createUrl(`answer/${id}/attachments/`)));
};

export const createPlotApplicationRequest = (payload): Generator <any, any, any> => {
  return callApi(new Request(createUrl(`answer/`), { method: 'POST', body: JSON.stringify(payload) }));
};

export const editPlotApplicationRequest = (payload): Generator <any, any, any> => {
  return callApi(new Request(createUrl(`answer/${id}/`), { method: 'POST', body: JSON.stringify(payload) }));
};

export const fetchAttachmentAttributesRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('attachment/'), {method: 'OPTIONS'}));
};

export const uploadFileRequest = ({ field, file, answer }: {
  field: number;
  file: File;
  answer: ?number;
}): Generator<any, any, any> => {
  const formData = new FormData();

  formData.append('field', field.toString());
  formData.append('name', file.name);
  formData.append('attachment', file);
  if (answer) {
    formData.append('answer', answer);
  }

  return callUploadRequest(
    new Request(createUrl('attachment/'), {
      method: 'POST',
      body: formData,
    })
  );
};

export const fetchPendingUploadsRequest = (): Generator<
  Effect,
  ApiCallResult,
  Response
  > => {
  return callApi(new Request(createUrl('attachment/')));
};

export const deleteUploadRequest = (
  id: number
): Generator<Effect, ApiCallResult, Response> => {
  return callApi(
    new Request(createUrl('attachment/' + id), {
      method: 'DELETE',
    })
  );
};
