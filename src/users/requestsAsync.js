// @flow
import createUrl from '$src/api/createUrl';
import callApiAsync from '$src/api/callApiAsync';

export const fetchUsers = async(query?: Object) => {
  const {response: {status}, bodyAsJson} = await callApiAsync(new Request(createUrl('user/', query)));

  switch (status) {
    case 200:
      return bodyAsJson.results;
    default:
      console.error('Failed to fetch users');
      return [];
  }
};
