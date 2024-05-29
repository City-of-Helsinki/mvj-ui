import callApi from "api/callApi";
import createUrl from "api/createUrl";
import callUploadRequest from "api/callUploadRequest";
export const fetchAreaSearchListAttributesRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('area_search/'), {
    method: 'OPTIONS'
  }));
};
export const fetchAreaSearchAttributesRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('area_search/1/'), {
    method: 'OPTIONS'
  }));
};
export const fetchAreaSearchesRequest = (params: Record<string, any> | null | undefined): Generator<any, any, any> => {
  return callApi(new Request(createUrl('area_search/', params)));
};
export const fetchSingleAreaSearchRequest = (id: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`area_search/${id}/`)));
};
export const editSingleAreaSearchRequest = (id: number, payload: Record<string, any>): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`area_search/${id}/`), {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }));
};
export const createAreaSearchSpecsRequest = ({
  area_search_attachments,
  geometry,
  ...rest
}: Record<string, any>): Generator<any, any, any> => {
  const payload = {
    area_search_attachments: area_search_attachments,
    geometry: JSON.stringify(geometry),
    ...rest
  };
  return callApi(new Request(createUrl('area_search/'), {
    method: 'POST',
    body: JSON.stringify(payload)
  }));
};
export const uploadAreaSearchAttachmentRequest = ({
  file,
  areaSearch
}: {
  file: File;
  areaSearch: number | null | undefined;
}): Generator<any, any, any> => {
  const formData = new FormData();
  formData.append('name', file.name);
  formData.append('attachment', file);

  if (areaSearch) {
    formData.append('area_search', areaSearch.toString());
  }

  return callUploadRequest(new Request(createUrl('area_search_attachment/'), {
    method: 'POST',
    body: formData
  }));
};
export const deleteAreaSearchAttachmentRequest = (id: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`area_search_attachment/${id}/`), {
    method: 'DELETE'
  }));
};