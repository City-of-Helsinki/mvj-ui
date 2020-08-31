// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {Property} from '$src/property/types';

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('plot_search/'), {method: 'OPTIONS'}));
};

export const createPlotSearch = (plotSearch: Property): Generator<any, any, any> => {
  const body = JSON.stringify(plotSearch);

  return callApi(new Request(createUrl(`plot_search/`), {
    method: 'POST',
    body,
  }));
};

export const fetchPlotSearches = (params: ?Object): Generator<any, any, any> => {
  return callApi(new Request(createUrl('plot_search/', params)));
};

export const fetchSinglePlotSearch = (id: any): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`plot_search/${id}/`)));
};
