import callApi from "../api/callApi";
import createUrl from "../api/createUrl";
export const fetchIndexList = (query: Record<string, any>): Generator<any, any, any> => {
  return callApi(new Request(createUrl('index/', query)));
};