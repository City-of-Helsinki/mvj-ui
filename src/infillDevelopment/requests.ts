import callApi from "@/api/callApi";
import createUrl from "@/api/createUrl";
import type { InfillDevelopment, InfillDevelopmentId } from "./types";
export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(
    new Request(createUrl(`infill_development_compensation/`), {
      method: "OPTIONS",
    }),
  );
};
export const fetchInfillDevelopments = (
  query: Record<string, any>,
): Generator<any, any, any> => {
  return callApi(
    new Request(createUrl("infill_development_compensation/", query)),
  );
};
export const fetchSingleInfillDevelopment = (
  id: InfillDevelopmentId,
): Generator<any, any, any> => {
  return callApi(
    new Request(createUrl(`infill_development_compensation/${id}/`)),
  );
};
export const createInfillDevelopment = (
  infillDevelopment: InfillDevelopment,
): Generator<any, any, any> => {
  const body = JSON.stringify(infillDevelopment);
  return callApi(
    new Request(createUrl("infill_development_compensation/"), {
      method: "POST",
      body,
    }),
  );
};
export const editInfillDevelopment = (
  infillDevelopment: InfillDevelopment,
): Generator<any, any, any> => {
  const { id } = infillDevelopment;
  const body = JSON.stringify(infillDevelopment);
  return callApi(
    new Request(createUrl(`infill_development_compensation/${id}/`), {
      method: "PATCH",
      body,
    }),
  );
};
