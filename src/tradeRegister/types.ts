import type { Action } from "types";
export type TradeRegisterState = {
  collapseStates: Record<string, any>;
  companyExtendedById: TradeRegisterDataMap;
  companyNoticeById: TradeRegisterDataMap;
  companyRepresentById: TradeRegisterDataMap;
  isFetchingCompanyExtendedById: TradeRegisterIsFetchingMap;
  isFetchingCompanyNoticeById: TradeRegisterIsFetchingMap;
  isFetchingCompanyRepresentById: TradeRegisterIsFetchingMap;
};
export type TradeRegisterDataMap = Record<string, Record<string, any>>;
export type TradeRegisterIsFetchingMap = Record<string, boolean>;
export type FetchTradeRegisterCompanyExtendedByIdAction = Action<
  string,
  string
>;
export type ReceiveTradeRegisterCompanyExtendedByIdAction = Action<
  string,
  TradeRegisterDataMap
>;
export type CompanyExtendedNotFoundByIdAction = Action<string, string>;
export type FetchTradeRegisterCompanyNoticeByIdAction = Action<string, string>;
export type ReceiveTradeRegisterCompanyNoticeByIdAction = Action<
  string,
  TradeRegisterDataMap
>;
export type CompanyNoticeNotFoundByIdAction = Action<string, string>;
export type FetchTradeRegisterCompanyRepresentByIdAction = Action<
  string,
  string
>;
export type ReceiveTradeRegisterCompanyRepresentByIdAction = Action<
  string,
  TradeRegisterDataMap
>;
export type CompanyRepresentNotFoundByIdAction = Action<string, string>;
export type ReceiveCollapseStatesAction = Action<string, Record<string, any>>;
