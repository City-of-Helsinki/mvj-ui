// @flow
import type {Action} from '$src/types';

export type TradeRegisterState = {
  collapseStates: Object,
  companyExtendedById: TradeRegisterDataMap,
  isFetchingCompanyExtendedById: TradeRegisterIsFetchingMap,
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

export type ReceiveCollapseStatesAction = Action<'mvj/tradeRegister/RECEIVE_COLLAPSE_STATES', Object>;
