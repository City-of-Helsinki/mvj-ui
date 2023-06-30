// @flow
import callApi from '$src/api/callApi';
import createUrl from '$src/api/createUrl';

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

export const createDirectReservationLinkRequest = (payload: Object): Generator<any, any, any> => {
  const body = JSON.stringify(payload);

  return callApi(new Request(createUrl('direct_reservation_link/'), {
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

export const fetchPlanUnitAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`plan_unit/1/`), {method: 'OPTIONS'}));
};

export const fetchPlanUnit = (id: any): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`plan_unit/${id}/`)));
};

export const fetchCustomDetailedPlanAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`custom_detailed_plan/1/`), {method: 'OPTIONS'}));
};

export const fetchCustomDetailedPlan = (id: any): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`custom_detailed_plan/${id}/`)));
};

export const fetchPlotSearchSubtypesRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('plot_search_subtype/')));
};

export const fetchTemplateFormsRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`form/`, {
    is_template: true,
  })));
};

export const fetchFormRequest = (id: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`form/${id}/`)));
};

export const fetchFormAttributesRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`form/1/`), {method: 'OPTIONS'}));
};

export const editFormRequest = (form: Object): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`form/${form.id}/`), {
    method: 'PATCH',
    body: JSON.stringify(form),
  }));
};

export const fetchStagesRequest = (params: ?Object): Generator<any, any, any> => {
  return callApi(new Request(createUrl('plot_search_stage/', params)));
};

export const fetchPlotSearchApplicationsRequest = (id: number): Generator<any, any, any> => {
  return callApi(new Request(createUrl('answer/', {
    plot_search_id: id,
  })));
};

export const editTargetPlotSearchRelationRequest = (payload: Object): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`plot_search_target/${payload.id}/`), {
    method: 'PATCH',
    body: JSON.stringify({
      reservation_identifier: payload.reservation_identifier,
    }),
  }));
};

export const fetchAllMunicipalitiesRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('municipality/?limit=10000')));
};

export const fetchAllDistrictsRequest = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('district/?limit=10000')));
};
