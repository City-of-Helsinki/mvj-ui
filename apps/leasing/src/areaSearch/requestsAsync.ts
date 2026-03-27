import callApiAsync from "@/api/callApiAsync";
import createUrl from "@/api/createUrl";

export const fetchAreaSearchDistricts = async <T = Array<{ district: string }>>(
  query?: Record<string, any>,
) => {
  const {
    response: { status },
    bodyAsJson,
  } = await callApiAsync<T>(
    new Request(createUrl("area_search_district/", query)),
  );

  switch (status) {
    case 200:
      return bodyAsJson;

    default:
      console.error("Failed to fetch areasearch districts");
      return [];
  }
};
