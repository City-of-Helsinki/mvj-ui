import callApi from "api/callApi";
import createUrl from "api/createUrl";
import callUploadRequest from "api/callUploadRequest";
export const fetchPlotApplications = (params: Record<string, any> | null | undefined): Generator<any, any, any> => {
  return callApi(new Request(createUrl('answer/', params)));
};
export const fetchSinglePlotApplication = (id: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`answer/${id}/`)));
};
export const fetchPlotSearchSubtypesRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('plot_search_subtype/')));
};
export const editApplicantInfoCheckItemRequest = (payload: Record<string, any>): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`information_check/${payload.id}/`), {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }));
};
export const editTargetInfoCheckItemRequest = (payload: Record<string, any>): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`target_status/${payload.id}/`), {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }));
};
export const createMeetingMemoRequest = ({
  file,
  name,
  targetInfoCheck
}: {
  file: File;
  name: string;
  targetInfoCheck: number;
}): Generator<any, any, any> => {
  const formData = new FormData();
  formData.append('target_status', targetInfoCheck.toString());
  formData.append('name', name);
  formData.append('meeting_memo', file);
  const body = formData;
  return callUploadRequest(new Request(createUrl('meeting_memo/'), {
    method: 'POST',
    body
  }));
};
export const deleteMeetingMemoRequest = (id: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`meeting_memo/${id}/`), {
    method: 'DELETE'
  }));
};
export const fetchMeetingMemoAttributesRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('meeting_memo/1/'), {
    method: 'OPTIONS'
  }));
};
export const fetchTargetInfoChecksForPlotSearchRequest = (id: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl('target_status', {
    plot_search: id
  })));
};
export const createOpeningRecordRequest = (id: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`answer_opening_record/`), {
    method: 'POST',
    body: JSON.stringify({
      openers: [],
      answer: id,
      note: ''
    })
  }));
};
export const editOpeningRecordRequest = (data: Record<string, any>): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`answer_opening_record/${data.id}/`), {
    method: 'PATCH',
    body: JSON.stringify({
      note: data.note,
      openers: data.openers
    })
  }));
};