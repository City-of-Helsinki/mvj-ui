// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {PlotSearch} from '$src/plotSearch/types';

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('plot_search/'), {method: 'OPTIONS'}));
};

export const createPlotSearch = (plotSearch: PlotSearch): Generator<any, any, any> => {
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

export const editPlotSearch = (PlotSearch: PlotSearch): Generator<any, any, any> => {
  const {id} = PlotSearch;
  const body = JSON.stringify(PlotSearch);
  return callApi(new Request(createUrl(`plot_search/${id}/`), {
    method: 'PATCH',
    body,
  }));
};

export const deletePlotSearch = (id: any): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`plot_search/${id}/`), {method: 'DELETE'}));
};

export const fetchPlanUnitAttributes = (id: any): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`plan_unit/${id}/`), {method: 'OPTIONS'}));
};

export const fetchPlanUnit = (id: any): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`plan_unit/${id}/`)));
};

export const fetchPlotSearchSubtypesRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('plot_search_subtype/')));
};

export const fetchTemplateFormsRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`form/`, {
    is_template: true,
  })));
};

export const fetchFormRequest = (id: any): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`form/${id}/`)));
};

export const fetchFormAttributesRequest = (id: any): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`form/${id}/`), {method: 'OPTIONS'}));
};

export const editFormRequest = (form: Object): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`form/${form.id}/`), {
    method: 'PATCH',
    body: JSON.stringify(form),
  }));
};
