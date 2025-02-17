import type { Action } from "types";
export type CreditDecisionState = {
  creditDecisionByBusinessId: CreditDecisionDataMap;
  creditDecisionByContactId: CreditDecisionDataMap;
  creditDecisionByNin: CreditDecisionDataMap;
  historyByBusinessId: HistoryDataMap;
  historyByContactId: HistoryDataMap;
  isFetchingCreditDecisionByBusinessId: IsFetchingCreditDecisionMap;
  isFetchingCreditDecisionByContactId: IsFetchingCreditDecisionMap;
  isFetchingCreditDecisionByNin: IsFetchingCreditDecisionMap;
  isFetchingHistoryByBusinessId: IsFetchingHistoryMap;
  isFetchingHistoryByContactId: IsFetchingHistoryMap;
};
export type HistoryDataMap = Record<string, any>;
export type IsFetchingHistoryMap = Record<string, boolean>;
export type CreditDecisionDataMap = Record<string, any>;
export type IsFetchingCreditDecisionMap = Record<string, boolean>;
export type FetchHistoryByBusinessIdAction = Action<string, string>;
export type FetchHistoryByContactIdAction = Action<string, string>;
export type HistoryNotFoundByBusinessIdAction = Action<string, string>;
export type HistoryNotFoundByContactIdAction = Action<string, string>;
export type ReceiveHistoryByBusinessIdAction = Action<string, HistoryDataMap>;
export type ReceiveHistoryByContactIdAction = Action<string, HistoryDataMap>;
export type FetchCreditDecisionByBusinessIdAction = Action<string, string>;
export type FetchCreditDecisionByContactIdAction = Action<string, string>;
export type FetchCreditDecisionByNinAction = Action<string, string>;
export type CreditDecisionNotFoundByBusinessIdAction = Action<string, string>;
export type CreditDecisionNotFoundByContactIdAction = Action<string, string>;
export type CreditDecisionNotFoundByNinAction = Action<string, string>;
export type ReceiveCreditDecisionByBusinessIdAction = Action<
  string,
  CreditDecisionDataMap
>;
export type ReceiveCreditDecisionByContactIdAction = Action<
  string,
  CreditDecisionDataMap
>;
export type ReceiveCreditDecisionByNinAction = Action<
  string,
  CreditDecisionDataMap
>;
