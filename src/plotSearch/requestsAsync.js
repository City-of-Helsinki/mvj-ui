// @flow
import createUrl from '$src/api/createUrl';
import callApiAsync from '$src/api/callApiAsync';

export const fetchPlanUnitListWithIdentifiersList = async(query?: Object) => {
  const {response: {status}, bodyAsJson} = await callApiAsync(new Request(createUrl('plan_unit_list_with_identifiers/', query)));

  switch (status) {
    case 200:
      return bodyAsJson.results;
    default:
      console.error('Failed to fetch Plan Unit List With Identifiers List');
      return [];
  }
};
