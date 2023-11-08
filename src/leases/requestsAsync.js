// @flow
import createUrl from '$src/api/createUrl';
import callApiAsync from '$src/api/callApiAsync';

export const fetchLeases = async(query?: Object) => {
  const {response: {status}, bodyAsJson} = await callApiAsync(new Request(createUrl('lease/', query)));

  switch (status) {
    case 200:
      return bodyAsJson.results;
    default:
      console.error('Failed to fetch leases');
      return [];
  }
};

export const fetchAreaSearches = async(query?: Object) => {
  const {response: {status}, bodyAsJson} = await callApiAsync(new Request(createUrl('area_search/', query)));

  switch (status) {
    case 200:
      return bodyAsJson.results;
    default:
      console.error('Failed to fetch area searches');
      return [];
  }
};

export const fetchPlotSearches = async(query?: Object) => {
  const {response: {status}, bodyAsJson} = await callApiAsync(new Request(createUrl('plot_search/', query)));

  switch (status) {
    case 200:
      return bodyAsJson.results;
    default:
      console.error('Failed to fetch target statuses');
      return [];
  }
};

export const fetchTargetStatuses = async(query?: Object) => {
  const {response: {status}, bodyAsJson} = await callApiAsync(new Request(createUrl('target_status/', query)));

  switch (status) {
    case 200:
      return bodyAsJson.results;
    default:
      console.error('Failed to fetch target statuses');
      return [];
  }
};

export const fetchDecisions = async(query?: Object) => {
  const {response: {status}, bodyAsJson} = await callApiAsync(new Request(createUrl('decision/', query)));

  switch (status) {
    case 200:
      return bodyAsJson.results;
    default:
      console.error('Failed to fetch decisions');
      return [];
  }
};
