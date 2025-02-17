import { createAction } from "redux-actions";
import type {
  TradeRegisterDataMap,
  FetchTradeRegisterCompanyExtendedByIdAction,
  ReceiveTradeRegisterCompanyExtendedByIdAction,
  CompanyExtendedNotFoundByIdAction,
  FetchTradeRegisterCompanyNoticeByIdAction,
  ReceiveTradeRegisterCompanyNoticeByIdAction,
  CompanyNoticeNotFoundByIdAction,
  FetchTradeRegisterCompanyRepresentByIdAction,
  ReceiveTradeRegisterCompanyRepresentByIdAction,
  CompanyRepresentNotFoundByIdAction,
  ReceiveCollapseStatesAction,
} from "@/tradeRegister/types";
export const fetchTradeRegisterCompanyExtendedById = (
  businessId: string,
): FetchTradeRegisterCompanyExtendedByIdAction =>
  createAction("mvj/tradeRegister/FETCH_COMPANY_EXTENDED_BY_ID")(businessId);
export const receiveTradeRegisterCompanyExtendedById = (
  payload: TradeRegisterDataMap,
): ReceiveTradeRegisterCompanyExtendedByIdAction =>
  createAction("mvj/tradeRegister/RECEIVE_COMPANY_EXTENDED_BY_ID")(payload);
export const companyExtendedNotFoundById = (
  businessId: string,
): CompanyExtendedNotFoundByIdAction =>
  createAction("mvj/tradeRegister/COMPANY_EXTENDED_NOT_FOUND_BY_ID")(
    businessId,
  );
export const fetchTradeRegisterCompanyNoticeById = (
  businessId: string,
): FetchTradeRegisterCompanyNoticeByIdAction =>
  createAction("mvj/tradeRegister/FETCH_COMPANY_NOTICE_BY_ID")(businessId);
export const receiveTradeRegisterCompanyNoticeById = (
  payload: TradeRegisterDataMap,
): ReceiveTradeRegisterCompanyNoticeByIdAction =>
  createAction("mvj/tradeRegister/RECEIVE_COMPANY_NOTICE_BY_ID")(payload);
export const companyNoticeNotFoundById = (
  businessId: string,
): CompanyNoticeNotFoundByIdAction =>
  createAction("mvj/tradeRegister/COMPANY_NOTICE_NOT_FOUND_BY_ID")(businessId);
export const fetchTradeRegisterCompanyRepresentById = (
  businessId: string,
): FetchTradeRegisterCompanyRepresentByIdAction =>
  createAction("mvj/tradeRegister/FETCH_COMPANY_REPRESENT_BY_ID")(businessId);
export const receiveTradeRegisterCompanyRepresentById = (
  payload: TradeRegisterDataMap,
): ReceiveTradeRegisterCompanyRepresentByIdAction =>
  createAction("mvj/tradeRegister/RECEIVE_COMPANY_REPRESENT_BY_ID")(payload);
export const companyRepresentNotFoundById = (
  businessId: string,
): CompanyRepresentNotFoundByIdAction =>
  createAction("mvj/tradeRegister/COMPANY_REPRESENT_NOT_FOUND_BY_ID")(
    businessId,
  );
export const receiveCollapseStates = (
  status: Record<string, any>,
): ReceiveCollapseStatesAction =>
  createAction("mvj/tradeRegister/RECEIVE_COLLAPSE_STATES")(status);
