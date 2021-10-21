// @flow
import type {Action} from '$src/types';

export type CreditDecisionState = {
  creditDecisionByBusinessId: CreditDecisionDataMap,
  creditDecisionByContactId: CreditDecisionDataMap,
  creditDecisionByNin: CreditDecisionDataMap,
  historyByBusinessId: HistoryDataMap,
  historyByContactId: HistoryDataMap,
  isFetchingCreditDecisionByBusinessId: IsFetchingCreditDecisionMap,
  isFetchingCreditDecisionByContactId: IsFetchingCreditDecisionMap,
  isFetchingCreditDecisionByNin: IsFetchingCreditDecisionMap,
  isFetchingHistoryByBusinessId: IsFetchingHistoryMap,
  isFetchingHistoryByContactId: IsFetchingHistoryMap,
};

export type HistoryDataMap = {
  [id: string]: Object,
}

export type IsFetchingHistoryMap = {
  [id: string]: boolean,
}

export type CreditDecisionDataMap = {
  [id: string]: Object,
}

export type IsFetchingCreditDecisionMap = {
  [id: string]: boolean,
}

export type FetchHistoryByBusinessIdAction = Action<'mvj/creditDecision/FETCH_HISTORY_BY_BUSINESS_ID', string>;
export type FetchHistoryByContactIdAction = Action<'mvj/creditDecision/FETCH_HISTORY_BY_CONTACT_ID', string>;
export type HistoryNotFoundByBusinessIdAction = Action<'mvj/creditDecision/HISTORY_NOT_FOUND_BY_BUSINESS_ID', string>;
export type HistoryNotFoundByContactIdAction = Action<'mvj/creditDecision/HISTORY_NOT_FOUND_BY_CONTACT_ID', string>;
export type ReceiveHistoryByBusinessIdAction = Action<'mvj/creditDecision/RECEIVE_HISTORY_BY_BUSINESS_ID', HistoryDataMap>;
export type ReceiveHistoryByContactIdAction = Action<'mvj/creditDecision/RECEIVE_HISTORY_BY_CONTACT_ID', HistoryDataMap>;

export type FetchCreditDecisionByBusinessIdAction = Action<'mvj/creditDecision/FETCH_CREDIT_DECISION_BY_BUSINESS_ID', string>;
export type FetchCreditDecisionByContactIdAction = Action<'mvj/creditDecision/FETCH_CREDIT_DECISION_BY_CONTACT_ID', string>;
export type FetchCreditDecisionByNinAction = Action<'mvj/creditDecision/FETCH_CREDIT_DECISION_BY_NIN', string>;
export type CreditDecisionNotFoundByBusinessIdAction = Action<'mvj/creditDecision/CREDIT_DECISION_NOT_FOUND_BY_BUSINESS_ID', string>;
export type CreditDecisionNotFoundByContactIdAction = Action<'mvj/creditDecision/CREDIT_DECISION_NOT_FOUND_BY_CONTACT_ID', string>;
export type CreditDecisionNotFoundByNinAction = Action<'mvj/creditDecision/CREDIT_DECISION_NOT_FOUND_BY_NIN', string>;
export type ReceiveCreditDecisionByBusinessIdAction = Action<'mvj/creditDecision/RECEIVE_CREDIT_DECISION_BY_BUSINESS_ID', CreditDecisionDataMap>;
export type ReceiveCreditDecisionByContactIdAction = Action<'mvj/creditDecision/RECEIVE_CREDIT_DECISION_BY_CONTACT_ID', CreditDecisionDataMap>;
export type ReceiveCreditDecisionByNinAction = Action<'mvj/creditDecision/RECEIVE_CREDIT_DECISION_BY_NIN', CreditDecisionDataMap>;
