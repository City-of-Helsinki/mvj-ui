import callApi from "@/api/callApi";
import createUrl from "@/api/createUrl";
export const fetchDistricts = (search: string) => {
  return callApi(new Request(createUrl(`district/${search || ''}`)));
};