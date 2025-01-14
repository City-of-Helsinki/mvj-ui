import callApi from "@/api/callApi";
import createUrl from "@/api/createUrl";

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(
    new Request(createUrl(`lease_create_collection_letter/`), {
      method: "OPTIONS",
    }),
  );
};
export const fetchLeaseInvoicingConfirmationReportAttributes = (): Generator<
  any,
  any,
  any
> => {
  return callApi(
    new Request(createUrl(`lease_create_collection_letter/`), {
      method: "OPTIONS",
    }),
  );
};
export const fetchLeaseInvoicingConfrimationReports = (
  params: Record<string, any> | null | undefined,
): Generator<any, any, any> => {
  return callApi(new Request(createUrl("scheduled_job/", params)));
};
export const fetchReports = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl("report/")));
};
export const fetchReportData = (
  payload: Record<string, any>,
): Generator<any, any, any> => {
  return callApi(new Request(`${payload.url}?${payload.query}`));
};
export const sendReportToMail = (
  payload: Record<string, any>,
): Generator<any, any, any> => {
  return callApi(new Request(`${payload.url}?${payload.query}`));
};
export const fetchOptions = (payload: any): Generator<any, any, any> => {
  return callApi(
    new Request(payload, {
      method: "OPTIONS",
    }),
  );
};
