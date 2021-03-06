// @flow
import callApi from '$src/api/callApi';
import createUrl from '$src/api/createUrl';

export const fetchAttributes = () => {
  return callApi(new Request(createUrl('ui_data/'), {method: 'OPTIONS'}));
};

export const fetchUiDataList = (query: Object) => {
  return callApi(new Request(createUrl('ui_data/', query)));
};

export const createUiData = (payload: Object) => {
  const body = JSON.stringify(payload);

  return callApi(new Request(createUrl(`ui_data/`), {
    method: 'POST',
    body,
  }));
};

export const deleteUiData = (id: number) => {
  return callApi(new Request(createUrl(`ui_data/${id}/`), {
    method: 'DELETE',
  }));
};

export const editUiData = (payload: Object) => {
  const body = JSON.stringify(payload);

  return callApi(new Request(createUrl(`ui_data/${payload.id}/`), {
    method: 'PATCH',
    body,
  }));
};
