import callApi from "@/api/callApi";
import createUrl from "@/api/createUrl";
export const fetchAttributes = () => {
  return callApi(
    new Request(createUrl("leasehold_transfer/"), {
      method: "OPTIONS",
    }),
  );
};
export const fetchLeaseholdTransferList = (query?: Record<string, any>) => {
  return callApi(new Request(createUrl("leasehold_transfer/", query)));
};
export const deleteLeaseholdTransfer = (id: number) => {
  return callApi(
    new Request(createUrl(`leasehold_transfer/${id}/`), {
      method: "DELETE",
    }),
  );
};
