import createUrl from "/src/api/createUrl";
import callApiAsync from "/src/api/callApiAsync";
export const fetchEstateIdList = async (query?: Record<string, any>) => {
  const {
    response: {
      status
    },
    bodyAsJson
  } = await callApiAsync(new Request(createUrl('plot_master_identifier_list/', query)));

  switch (status) {
    case 200:
      return bodyAsJson.results;

    default:
      console.error('Failed to fetch Estate Id List');
      return [];
  }
};