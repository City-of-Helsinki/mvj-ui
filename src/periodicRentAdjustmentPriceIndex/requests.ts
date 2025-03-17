import callApi from "@/api/callApi";
import createUrl from "@/api/createUrl";
import { DEFAULT_PERIODIC_RENT_ADJUSTMENT_PRICE_INDEX_ID } from "./constants";

export const fetchPeriodicRentAdjustmentPriceIndex = (): Generator<
  any,
  any,
  any
> => {
  // As of the beginning of 2025, there is only one index.
  const id = DEFAULT_PERIODIC_RENT_ADJUSTMENT_PRICE_INDEX_ID;

  return callApi(
    new Request(createUrl(`periodic_rent_adjustment_price_index/${id}/`)),
  );
};
