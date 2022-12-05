// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';
import callUploadRequest from '../api/callUploadRequest';

export const fetchPlotApplications = (params: ?Object): Generator<any, any, any> => {
  return callApi(new Request(createUrl('answer/', params)));
};

export const fetchSinglePlotApplication = (id: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`answer/${id}/`)));
};

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('answer/'), {method: 'OPTIONS'}));
};

export const fetchPlotSearchSubtypesRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('plot_search_subtype/')));
};

export const fetchSinglePlotApplicationAttachments = (id: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`answer/${id}/attachments/`)));
};

export const createPlotApplicationRequest = (payload: Object): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`answer/`), {method: 'POST', body: JSON.stringify(payload)}));
};

export const editPlotApplicationRequest = (id: number, payload: Object): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`answer/${id}/`), {method: 'PATCH', body: JSON.stringify(payload)}));
};

export const fetchAttachmentAttributesRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('attachment/'), {method: 'OPTIONS'}));
};

export const fetchInfoCheckAttributesRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('information_check/'), {method: 'OPTIONS'}));
};

export const uploadFileRequest = ({field, file, answer}: {
  field: number;
  file: File;
  answer: ?number;
}): Generator<any, any, any> => {
  const formData = new FormData();

  formData.append('field', field.toString());
  formData.append('name', file.name);
  formData.append('attachment', file);
  if (answer) {
    formData.append('answer', answer.toString());
  }

  return callUploadRequest(
    new Request(createUrl('attachment/'), {
      method: 'POST',
      body: formData,
    })
  );
};

export const fetchPendingUploadsRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('attachment/')));
};

export const deleteUploadRequest = (
  id: number
): Generator<any, any, any> => {
  return callApi(
    new Request(createUrl('attachment/' + id), {
      method: 'DELETE',
    })
  );
};

export const editInfoCheckItemRequest = (payload: Object): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`information_check/${payload.id}/`), {method: 'PATCH', body: JSON.stringify(payload)}));
};
