import type { Action } from "@/types";
export type ServiceUnit = { id: number, name: string, use_rent_override_receivable_type: boolean };
export type ServiceUnits = Array<ServiceUnit>;
export type ServiceUnitState = {
  isFetching: boolean;
  serviceUnits: ServiceUnits;
};
export type FetchServiceUnitsAction = Action<string, void>;
export type ReceiveServiceUnitsAction = Action<string, ServiceUnits>;
export type ServiceUnitsNotFoundAction = Action<string, void>;
