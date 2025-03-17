import type { Action } from "@/types";

export type IndexPointFigureYearly = {
  value: number;
  year: number;
  region: string;
  comment: string;
};

export type PeriodicRentAdjustmentPriceIndex = {
  code: string;
  name: string;
  comment: string;
  source: string;
  source_table_updated?: string;
  source_table_label: string;
  url: string;
  point_figures: IndexPointFigureYearly[];
};
export type PeriodicRentAdjustmentIndexId = number;

export type PeriodicRentAdjustmentPriceIndexState = {
  isFetching: boolean;
  latest: PeriodicRentAdjustmentPriceIndex;
};

export type FetchPeriodicRentAdjustmentPriceIndexAction = Action<string, void>;
export type ReceivePeriodicRentAdjustmentPriceIndexAction = Action<
  string,
  PeriodicRentAdjustmentPriceIndex
>;
export type PeriodicRentAdjustmentPriceIndexNotFoundAction = Action<
  string,
  void
>;
