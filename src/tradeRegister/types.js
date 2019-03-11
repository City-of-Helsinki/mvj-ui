// @flow
import type {Action} from '$src/types';

export type TradeRegisterState = {
  collapseStates: Object,
  companyExtendedById: TradeRegisterDataMap,
  companyNoticeById: TradeRegisterDataMap,
  companyRepresentById: TradeRegisterDataMap,
  isFetchingCompanyExtendedById: TradeRegisterIsFetchingMap,
  isFetchingCompanyNoticeById: TradeRegisterIsFetchingMap,
  isFetchingCompanyRepresentById: TradeRegisterIsFetchingMap,
};

export type TradeRegisterDataMap = {
  [businessId: string]: Object,
}

export type TradeRegisterIsFetchingMap = {
  [businessId: string]: boolean,
}

export type FetchTradeRegisterCompanyExtendedByIdAction = Action<'mvj/tradeRegister/FETCH_COMPANY_EXTENDED_BY_ID', string>;
export type ReceiveTradeRegisterCompanyExtendedByIdAction = Action<'mvj/tradeRegister/RECEIVE_COMPANY_EXTENDED_BY_ID', TradeRegisterDataMap>;
export type CompanyExtendedNotFoundByIdAction = Action<'mvj/tradeRegister/COMPANY_EXTENDED_NOT_FOUND_BY_ID', string>;

export type FetchTradeRegisterCompanyNoticeByIdAction = Action<'mvj/tradeRegister/FETCH_COMPANY_NOTICE_BY_ID', string>;
export type ReceiveTradeRegisterCompanyNoticeByIdAction = Action<'mvj/tradeRegister/RECEIVE_COMPANY_NOTICE_BY_ID', TradeRegisterDataMap>;
export type CompanyNoticeNotFoundByIdAction = Action<'mvj/tradeRegister/COMPANY_NOTICE_NOT_FOUND_BY_ID', string>;

export type FetchTradeRegisterCompanyRepresentByIdAction = Action<'mvj/tradeRegister/FETCH_COMPANY_REPRESENT_BY_ID', string>;
export type ReceiveTradeRegisterCompanyRepresentByIdAction = Action<'mvj/tradeRegister/RECEIVE_COMPANY_REPRESENT_BY_ID', TradeRegisterDataMap>;
export type CompanyRepresentNotFoundByIdAction = Action<'mvj/tradeRegister/COMPANY_REPRESENT_NOT_FOUND_BY_ID', string>;

export type ReceiveCollapseStatesAction = Action<'mvj/tradeRegister/RECEIVE_COLLAPSE_STATES', Object>;
