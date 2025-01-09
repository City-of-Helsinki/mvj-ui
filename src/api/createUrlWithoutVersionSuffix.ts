import { getApiUrlWithOutVersionSuffix } from "@/util/helpers";
import { stringifyQuery } from "./createUrl";
export default (url: string, params?: Record<string, any>) => {
  const apiUrlWithOutVersionSuffix = getApiUrlWithOutVersionSuffix();
  return `${apiUrlWithOutVersionSuffix}/${url}${params ? `?${stringifyQuery(params)}` : ""}`;
};
