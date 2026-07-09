import type { Action } from "@/types";

export type IntendedUseState = {
  isFetching: boolean;
  list: IntendedUseList;
};

export type IntendedUse = {
  id: number;
  name: string;
  name_fi?: string;
  name_sv?: string;
  name_en?: string;
  is_active: boolean;
  service_unit: string;
};

export type IntendedUseList = Array<IntendedUse>;

export type FetchIntendedUseAction = Action<string, void>;
export type ReceiveIntendedUseAction = Action<string, IntendedUseList>;
export type IntendedUseNotFoundAction = Action<string, void>;
