import type { Action } from "@/types";
export type VatState = {
  isFetching: boolean;
  list: VatList;
};
export type VatList = Array<Record<string, any>>;
export type FetchVatsAction = Action<string, void>;
export type ReceiveVatsAction = Action<string, VatList>;
export type VatsNotFoundAction = Action<string, void>;
