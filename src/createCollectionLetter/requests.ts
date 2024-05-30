import callApi from "../api/callApi";
import createUrl from "../api/createUrl";
export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease_create_collection_letter/`), {
    method: 'OPTIONS'
  }));
};