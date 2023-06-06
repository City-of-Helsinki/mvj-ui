// @flow
import callApi from '$src/api/callApi';
import createUrl from '$src/api/createUrl';

export const fetchAreaSearchListAttributesRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('area_search/'), {
    method: 'OPTIONS',
  }));
};

export const fetchAreaSearchAttributesRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('area_search/1/'), {
    method: 'OPTIONS',
  }));
};

export const fetchAreaSearchesRequest = (params: ?Object): Generator<any, any, any> => {
  return callApi(new Request(createUrl('area_search/', params)));
};

export const fetchSingleAreaSearchRequest = (id: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`area_search/${id}/`)));
};

export const editSingleAreaSearchRequest = (id: number, payload: Object): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`area_search/${id}/`), {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }));
};

