// @flow
import callApi from '$src/api/callApi';
import createUrl from '$src/api/createUrl';

export const fetchAreaSearchAttributesRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('area_search/'), {
    method: 'OPTIONS',
  }));
};

export const fetchAreaSearchesRequest = (params: ?Object): Generator<any, any, any> => {
  return callApi(new Request(createUrl('area_search/', params)));
};

export const fetchSingleAreaSearchRequest = (id: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`area_search/${id}`)));
};

