import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Reducer } from "src/types";
import type { TradeRegisterDataMap, TradeRegisterIsFetchingMap, FetchTradeRegisterCompanyExtendedByIdAction, ReceiveTradeRegisterCompanyExtendedByIdAction, CompanyExtendedNotFoundByIdAction, FetchTradeRegisterCompanyNoticeByIdAction, ReceiveTradeRegisterCompanyNoticeByIdAction, CompanyNoticeNotFoundByIdAction, FetchTradeRegisterCompanyRepresentByIdAction, ReceiveTradeRegisterCompanyRepresentByIdAction, CompanyRepresentNotFoundByIdAction, ReceiveCollapseStatesAction } from "src/tradeRegister/types";
const isFetchingCompanyExtendedByIdReducer: Reducer<TradeRegisterIsFetchingMap> = handleActions({
  ['mvj/tradeRegister/FETCH_COMPANY_EXTENDED_BY_ID']: (state: TradeRegisterIsFetchingMap, {
    payload: businessId
  }: FetchTradeRegisterCompanyExtendedByIdAction) => ({ ...state,
    [businessId]: true
  }),
  ['mvj/tradeRegister/RECEIVE_COMPANY_EXTENDED_BY_ID']: (state: TradeRegisterIsFetchingMap, {
    payload
  }: ReceiveTradeRegisterCompanyExtendedByIdAction) => ({ ...state,
    ...Object.keys(payload).reduce((obj, key) => ({ ...obj,
      [key]: false
    }), {})
  }),
  ['mvj/tradeRegister/COMPANY_EXTENDED_NOT_FOUND_BY_ID']: (state: TradeRegisterIsFetchingMap, {
    payload: businessId
  }: CompanyExtendedNotFoundByIdAction) => ({ ...state,
    [businessId]: false
  })
}, {});
const companyExtendedByIdReducer: Reducer<TradeRegisterDataMap> = handleActions({
  ['mvj/tradeRegister/RECEIVE_COMPANY_EXTENDED_BY_ID']: (state: TradeRegisterDataMap, {
    payload
  }: ReceiveTradeRegisterCompanyExtendedByIdAction) => ({ ...state,
    ...payload
  })
}, {});
const isFetchingCompanyNoticeByIdReducer: Reducer<TradeRegisterIsFetchingMap> = handleActions({
  ['mvj/tradeRegister/FETCH_COMPANY_NOTICE_BY_ID']: (state: TradeRegisterIsFetchingMap, {
    payload: businessId
  }: FetchTradeRegisterCompanyNoticeByIdAction) => ({ ...state,
    [businessId]: true
  }),
  ['mvj/tradeRegister/RECEIVE_COMPANY_NOTICE_BY_ID']: (state: TradeRegisterIsFetchingMap, {
    payload
  }: ReceiveTradeRegisterCompanyNoticeByIdAction) => ({ ...state,
    ...Object.keys(payload).reduce((obj, key) => ({ ...obj,
      [key]: false
    }), {})
  }),
  ['mvj/tradeRegister/COMPANY_NOTICE_NOT_FOUND_BY_ID']: (state: TradeRegisterIsFetchingMap, {
    payload: businessId
  }: CompanyNoticeNotFoundByIdAction) => ({ ...state,
    [businessId]: false
  })
}, {});
const companyNoticeByIdReducer: Reducer<TradeRegisterDataMap> = handleActions({
  ['mvj/tradeRegister/RECEIVE_COMPANY_NOTICE_BY_ID']: (state: TradeRegisterDataMap, {
    payload
  }: ReceiveTradeRegisterCompanyNoticeByIdAction) => ({ ...state,
    ...payload
  })
}, {});
const isFetchingCompanyRepresentByIdReducer: Reducer<TradeRegisterIsFetchingMap> = handleActions({
  ['mvj/tradeRegister/FETCH_COMPANY_REPRESENT_BY_ID']: (state: TradeRegisterIsFetchingMap, {
    payload: businessId
  }: FetchTradeRegisterCompanyRepresentByIdAction) => ({ ...state,
    [businessId]: true
  }),
  ['mvj/tradeRegister/RECEIVE_COMPANY_REPRESENT_BY_ID']: (state: TradeRegisterIsFetchingMap, {
    payload
  }: ReceiveTradeRegisterCompanyRepresentByIdAction) => ({ ...state,
    ...Object.keys(payload).reduce((obj, key) => ({ ...obj,
      [key]: false
    }), {})
  }),
  ['mvj/tradeRegister/COMPANY_REPRESENT_NOT_FOUND_BY_ID']: (state: TradeRegisterIsFetchingMap, {
    payload: businessId
  }: CompanyRepresentNotFoundByIdAction) => ({ ...state,
    [businessId]: false
  })
}, {});
const companyRepresentByIdReducer: Reducer<TradeRegisterDataMap> = handleActions({
  ['mvj/tradeRegister/RECEIVE_COMPANY_REPRESENT_BY_ID']: (state: TradeRegisterDataMap, {
    payload
  }: ReceiveTradeRegisterCompanyRepresentByIdAction) => ({ ...state,
    ...payload
  })
}, {});
const collapseStatesReducer: Reducer<Record<string, any>> = handleActions({
  ['mvj/tradeRegister/RECEIVE_COLLAPSE_STATES']: (state: Record<string, any>, {
    payload: states
  }: ReceiveCollapseStatesAction) => ({ ...state,
    ...states
  })
}, {});
export default combineReducers<Record<string, any>, any>({
  collapseStates: collapseStatesReducer,
  companyExtendedById: companyExtendedByIdReducer,
  companyNoticeById: companyNoticeByIdReducer,
  companyRepresentById: companyRepresentByIdReducer,
  isFetchingCompanyExtendedById: isFetchingCompanyExtendedByIdReducer,
  isFetchingCompanyNoticeById: isFetchingCompanyNoticeByIdReducer,
  isFetchingCompanyRepresentById: isFetchingCompanyRepresentByIdReducer
});