import callApi from "@/api/callApi";
import createUrl from "@/api/createUrl";
import { DEFAULT_OLD_DWELLINGS_IN_HOUSING_COMPANIES_PRICE_INDEX_ID } from "./constants";

export const fetchOldDwellingsInHousingCompaniesPriceIndex = (): Generator<
  any,
  any,
  any
> => {
  // As of the beginning of 2025, there is only one index.
  const id = DEFAULT_OLD_DWELLINGS_IN_HOUSING_COMPANIES_PRICE_INDEX_ID;

  return callApi(
    new Request(
      createUrl(`old_dwellings_in_housing_companies_price_index/${id}`),
    ),
  );
};
