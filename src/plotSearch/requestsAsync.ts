import createUrl from "/src/api/createUrl";
import callApiAsync from "/src/api/callApiAsync";
export const fetchPlanUnitListWithIdentifiersList = async (query?: Record<string, any>): Promise<Array<Record<string, any>>> => {
  const {
    response: {
      status
    },
    bodyAsJson
  } = await callApiAsync(new Request(createUrl('plan_unit_list_with_identifiers/', query)));

  switch (status) {
    case 200:
      return bodyAsJson.results;

    default:
      console.error('Failed to fetch Plan Unit List With Identifiers List');
      return [];
  }
};
export const fetchCustomDetailedPlanListWithIdentifiersList = async (query?: Record<string, any>): Promise<Array<Record<string, any>>> => {
  const {
    response: {
      status
    },
    bodyAsJson
  } = await callApiAsync(new Request(createUrl('custom_detailed_plan_list_with_identifiers/', query)));

  switch (status) {
    case 200:
      return bodyAsJson.results;

    default:
      console.error('Failed to fetch Custom Detailed Plan List With Identifiers List');
      return [];
  }
};