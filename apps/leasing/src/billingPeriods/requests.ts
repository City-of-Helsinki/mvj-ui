import callApi from "@/api/callApi";
import createUrl from "@/api/createUrl";
import type { FetchBillingPeriodsPayload } from "./types";
export const fetchBillingPeriods = (
  payload: FetchBillingPeriodsPayload,
): Generator<any, any, any> => {
  return callApi(
    new Request(
      createUrl(
        `lease_billing_periods/?lease=${payload.leaseId}&year=${payload.year}`,
      ),
    ),
  );
};
