import callApi from "@/api/callApi";
import createUrl from "@/api/createUrl";
export const fetchAttributes = () => {
  return callApi(
    new Request(createUrl("ui_data/"), {
      method: "OPTIONS",
    }),
  );
};
export const fetchUiDataList = (query: Record<string, any>) => {
  return callApi(new Request(createUrl("ui_data/", query)));
};
export const createUiData = (payload: Record<string, any>) => {
  const body = JSON.stringify(payload);
  return callApi(
    new Request(createUrl(`ui_data/`), {
      method: "POST",
      body,
    }),
  );
};
export const deleteUiData = (id: number) => {
  return callApi(
    new Request(createUrl(`ui_data/${id}/`), {
      method: "DELETE",
    }),
  );
};
export const editUiData = (payload: Record<string, any>) => {
  const body = JSON.stringify(payload);
  return callApi(
    new Request(createUrl(`ui_data/${payload.id}/`), {
      method: "PATCH",
      body,
    }),
  );
};
