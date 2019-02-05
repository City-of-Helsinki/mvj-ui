// @flow
import createUrl from '$src/api/createUrl';
import callApiOutsideSaga from '$src/api/callApiOutsideSaga';

export const fetchContacts = async(query?: Object) => {
  const {response: {status}, bodyAsJson} = await callApiOutsideSaga(new Request(createUrl('contact/', query)));

  switch (status) {
    case 200:
      return bodyAsJson.results;
    default:
      console.error('Failed to fetch contacts');
      return [];
  }
};
