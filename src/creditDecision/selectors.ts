import type { RootState } from "@/root/types";
import type { Selector } from "types";
export const getIsFetchingHistoryByBusinessId: Selector<boolean, string> = (
  state: RootState,
  id: string,
): boolean => state.creditDecision.isFetchingHistoryByBusinessId[id];
export const getIsFetchingHistoryByContactId: Selector<boolean, string> = (
  state: RootState,
  id: string,
): boolean => state.creditDecision.isFetchingHistoryByContactId[id];
export const getHistoryByBusinessId: Selector<
  Record<string, any> | null | undefined,
  string
> = (state: RootState, id: string): Record<string, any> | null | undefined =>
  state.creditDecision.historyByBusinessId[id];
export const getHistoryByContactId: Selector<
  Record<string, any> | null | undefined,
  string
> = (state: RootState, id: string): Record<string, any> | null | undefined =>
  state.creditDecision.historyByContactId[id];
export const getIsFetchingCreditDecisionByBusinessId: Selector<
  boolean,
  string
> = (state: RootState, id: string): boolean =>
  state.creditDecision.isFetchingCreditDecisionByBusinessId[id];
export const getIsFetchingCreditDecisionByContactId: Selector<
  boolean,
  string
> = (state: RootState, id: string): boolean =>
  state.creditDecision.isFetchingCreditDecisionByContactId[id];
export const getIsFetchingCreditDecisionByNin: Selector<boolean, string> = (
  state: RootState,
  id: string,
): boolean => state.creditDecision.isFetchingCreditDecisionByNin[id];
export const getCreditDecisionByBusinessId: Selector<
  Record<string, any> | null | undefined,
  string
> = (state: RootState, id: string): Record<string, any> | null | undefined =>
  state.creditDecision.creditDecisionByBusinessId[id];
export const getCreditDecisionByContactId: Selector<
  Record<string, any> | null | undefined,
  string
> = (state: RootState, id: string): Record<string, any> | null | undefined =>
  state.creditDecision.creditDecisionByContactId[id];
export const getCreditDecisionByNin: Selector<
  Record<string, any> | null | undefined,
  string
> = (state: RootState, id: string): Record<string, any> | null | undefined =>
  state.creditDecision.creditDecisionByNin[id];
