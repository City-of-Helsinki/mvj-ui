import callApi from "@/api/callApi";
import createUrl from "@/api/createUrl";
export const fetchServiceUnits = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl("service_unit/")));
};
