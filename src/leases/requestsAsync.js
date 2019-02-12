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
