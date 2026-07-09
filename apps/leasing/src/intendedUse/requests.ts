import callApi from "@/api/callApi";
import createUrl from "@/api/createUrl";

export const fetchIntendedUse = (
  params?: Record<string, any>,
): Generator<any, any, any> => {
  return callApi(new Request(createUrl("intended_use/", params)));
};
