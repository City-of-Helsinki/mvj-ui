// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

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
