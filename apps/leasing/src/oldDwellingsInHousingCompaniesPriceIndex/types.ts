import type { Action } from "@/types";

export type IndexPointFigureYearly = {
  value: number;
  year: number;
  region: string;
  comment: string;
};

export type OldDwellingsInHousingCompaniesPriceIndex = {
  code: string;
  name: string;
  comment: string;
  source: string;
  source_table_updated?: string;
  source_table_label: string;
  url: string;
  point_figures: IndexPointFigureYearly[];
};
export type OldDwellingsInHousingCompaniesPriceIndexId = number;

export type OldDwellingsInHousingCompaniesPriceIndexState = {
  isFetching: boolean;
  latest: OldDwellingsInHousingCompaniesPriceIndex;
};

export type FetchOldDwellingsInHousingCompaniesPriceIndexAction = Action<
  string,
  void
>;
export type ReceiveOldDwellingsInHousingCompaniesPriceIndexAction = Action<
  string,
  OldDwellingsInHousingCompaniesPriceIndex
>;
export type OldDwellingsInHousingCompaniesPriceIndexNotFoundAction = Action<
  string,
  void
>;
