import { createAction } from "redux-actions";
import type {
  CreditDecisionNotFoundByBusinessIdAction,
  CreditDecisionNotFoundByContactIdAction,
  CreditDecisionNotFoundByNinAction,
  FetchCreditDecisionByBusinessIdAction,
  FetchCreditDecisionByContactIdAction,
  FetchCreditDecisionByNinAction,
  FetchHistoryByBusinessIdAction,
  FetchHistoryByContactIdAction,
  HistoryDataMap,
  HistoryNotFoundByBusinessIdAction,
  HistoryNotFoundByContactIdAction,
  ReceiveCreditDecisionByBusinessIdAction,
  ReceiveCreditDecisionByContactIdAction,
  ReceiveCreditDecisionByNinAction,
  ReceiveHistoryByBusinessIdAction,
  ReceiveHistoryByContactIdAction,
} from "@/creditDecision/types";
export const fetchHistoryByBusinessId = (
  id: string,
): FetchHistoryByBusinessIdAction =>
  createAction("mvj/creditDecision/FETCH_HISTORY_BY_BUSINESS_ID")(id);
export const receiveHistoryByBusinessId = (
  payload: HistoryDataMap,
): ReceiveHistoryByBusinessIdAction =>
  createAction("mvj/creditDecision/RECEIVE_HISTORY_BY_BUSINESS_ID")(payload);
export const historyNotFoundByBusinessId = (
  id: string,
): HistoryNotFoundByBusinessIdAction =>
  createAction("mvj/creditDecision/HISTORY_NOT_FOUND_BY_BUSINESS_ID")(id);
export const fetchHistoryByContactId = (
  id: string,
): FetchHistoryByContactIdAction =>
  createAction("mvj/creditDecision/FETCH_HISTORY_BY_CONTACT_ID")(id);
export const receiveHistoryByContactId = (
  payload: HistoryDataMap,
): ReceiveHistoryByContactIdAction =>
  createAction("mvj/creditDecision/RECEIVE_HISTORY_BY_CONTACT_ID")(payload);
export const historyNotFoundByContactId = (
  id: string,
): HistoryNotFoundByContactIdAction =>
  createAction("mvj/creditDecision/HISTORY_NOT_FOUND_BY_CONTACT_ID")(id);
export const fetchCreditDecisionByBusinessId = (
  id: string,
): FetchCreditDecisionByBusinessIdAction =>
  createAction("mvj/creditDecision/FETCH_CREDIT_DECISION_BY_BUSINESS_ID")(id);
export const receiveCreditDecisionByBusinessId = (
  payload: any,
): ReceiveCreditDecisionByBusinessIdAction =>
  createAction("mvj/creditDecision/RECEIVE_CREDIT_DECISION_BY_BUSINESS_ID")(
    payload,
  );
export const creditDecisionNotFoundByBusinessId = (
  id: string,
): CreditDecisionNotFoundByBusinessIdAction =>
  createAction("mvj/creditDecision/CREDIT_DECISION_NOT_FOUND_BY_BUSINESS_ID")(
    id,
  );
export const fetchCreditDecisionByContactId = (
  id: string,
): FetchCreditDecisionByContactIdAction =>
  createAction("mvj/creditDecision/FETCH_CREDIT_DECISION_BY_CONTACT_ID")(id);
export const receiveCreditDecisionByContactId = (
  payload: any,
): ReceiveCreditDecisionByContactIdAction =>
  createAction("mvj/creditDecision/RECEIVE_CREDIT_DECISION_BY_CONTACT_ID")(
    payload,
  );
export const creditDecisionNotFoundByContactId = (
  id: string,
): CreditDecisionNotFoundByContactIdAction =>
  createAction("mvj/creditDecision/CREDIT_DECISION_NOT_FOUND_BY_CONTACT_ID")(
    id,
  );
export const fetchCreditDecisionByNin = (
  id: string,
): FetchCreditDecisionByNinAction =>
  createAction("mvj/creditDecision/FETCH_CREDIT_DECISION_BY_NIN")(id);
export const receiveCreditDecisionByNin = (
  payload: any,
): ReceiveCreditDecisionByNinAction =>
  createAction("mvj/creditDecision/RECEIVE_CREDIT_DECISION_BY_NIN")(payload);
export const creditDecisionNotFoundByNin = (
  id: string,
): CreditDecisionNotFoundByNinAction =>
  createAction("mvj/creditDecision/CREDIT_DECISION_NOT_FOUND_BY_NIN")(id);
