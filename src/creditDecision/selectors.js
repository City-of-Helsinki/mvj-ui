// @flow
import type {RootState} from '$src/root/types';
import type {Selector} from '$src/types';

export const getIsFetchingHistoryByBusinessId: Selector<boolean, string> = (state: RootState, id: string): boolean =>
  state.creditDecision.isFetchingHistoryByBusinessId[id];

export const getIsFetchingHistoryByContactId: Selector<boolean, string> = (state: RootState, id: string): boolean =>
  state.creditDecision.isFetchingHistoryByContactId[id];

export const getHistoryByBusinessId: Selector<?Object, string> = (state: RootState, id: string): ?Object =>
  state.creditDecision.historyByBusinessId[id];

export const getHistoryByContactId: Selector<?Object, string> = (state: RootState, id: string): ?Object =>
  state.creditDecision.historyByContactId[id];


export const getIsFetchingCreditDecisionByBusinessId: Selector<boolean, string> = (state: RootState, id: string): boolean =>
  state.creditDecision.isFetchingCreditDecisionByBusinessId[id];

export const getIsFetchingCreditDecisionByContactId: Selector<boolean, string> = (state: RootState, id: string): boolean =>
  state.creditDecision.isFetchingCreditDecisionByContactId[id];

export const getIsFetchingCreditDecisionByNin: Selector<boolean, string> = (state: RootState, id: string): boolean =>
  state.creditDecision.isFetchingCreditDecisionByNin[id];

export const getCreditDecisionByBusinessId: Selector<?Object, string> = (state: RootState, id: string): ?Object =>
  state.creditDecision.creditDecisionByBusinessId[id];

export const getCreditDecisionByContactId: Selector<?Object, string> = (state: RootState, id: string): ?Object =>
  state.creditDecision.creditDecisionByContactId[id];

export const getCreditDecisionByNin: Selector<?Object, string> = (state: RootState, id: string): ?Object =>
  state.creditDecision.creditDecisionByNin[id];
