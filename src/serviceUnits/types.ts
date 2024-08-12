import type { Action } from "../types";
export type ServiceUnit = { id: number, name: string };
export type ServiceUnits = Array<Record<string, any>>;
export type ServiceUnitState = {
  isFetching: boolean;
  serviceUnits: ServiceUnits;
};
export type FetchServiceUnitsAction = Action<string, void>;
export type ReceiveServiceUnitsAction = Action<string, ServiceUnits>;
export type ServiceUnitsNotFoundAction = Action<string, void>;