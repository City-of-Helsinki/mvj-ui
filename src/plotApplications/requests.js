// @flow
import callApi from '$src/api/callApi';
import createUrl from '$src/api/createUrl';
import callUploadRequest from '$src/api/callUploadRequest';

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

export const fetchApplicantInfoCheckAttributesRequest = (): Generator<any, any, any> => {
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
    new Request(createUrl(`attachment/${id}/`), {
      method: 'DELETE',
    })
  );
};

export const editApplicantInfoCheckItemRequest = (payload: Object): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`information_check/${payload.id}/`), {method: 'PATCH', body: JSON.stringify(payload)}));
};

export const editTargetInfoCheckItemRequest = (payload: Object): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`target_status/${payload.id}/`), {method: 'PATCH', body: JSON.stringify(payload)}));
};

export const createMeetingMemoRequest = ({
  file,
  name,
  targetInfoCheck,
}: {
  file: File,
  name: string,
  targetInfoCheck: number,
}): Generator<any, any, any> => {
  const formData = new FormData();
  formData.append('target_status', targetInfoCheck.toString());
  formData.append('name', name);
  formData.append('meeting_memo', file);

  const body = formData;
  return callUploadRequest(new Request(createUrl('meeting_memo/'), {
    method: 'POST',
    body,
  }));
};

export const deleteMeetingMemoRequest = (id: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`meeting_memo/${id}/`), {
    method: 'DELETE',
  }));
};

export const fetchMeetingMemoAttributesRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('meeting_memo/1/'), {method: 'OPTIONS'}));
};
