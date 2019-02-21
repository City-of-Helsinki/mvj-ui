// @flow
import callApi from '$src/api/callApi';
import createUrl from '$src/api/createUrl';

export const fetchAttributes = () => {
  return callApi(new Request(createUrl('ui_data/'), {method: 'OPTIONS'}));
};

export const fetchUiDataList = (query: Object) => {
  return callApi(new Request(createUrl('ui_data/', query)));
};
