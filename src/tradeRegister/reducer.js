// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '$src/types';
import type {
  TradeRegisterDataMap,
  TradeRegisterIsFetchingMap,
  ReceiveTradeRegisterCompanyExtendedByIdAction,
  CompanyExtendedNotFoundByIdAction,
  ReceiveCollapseStatesAction,
} from '$src/tradeRegister/types';

const isFetchingCompanyExtendedByIdReducer: Reducer<TradeRegisterIsFetchingMap> = handleActions({
  ['mvj/tradeRegister/FETCH_COMPANY_EXTENDED_BY_ID']: (state:TradeRegisterIsFetchingMap, {payload: businessId}: ReceiveTradeRegisterCompanyExtendedByIdAction) => ({
    ...state,
    [businessId]: true,
  }),
  ['mvj/tradeRegister/RECEIVE_COMPANY_EXTENDED_BY_ID']: (state: TradeRegisterIsFetchingMap, {payload}: ReceiveTradeRegisterCompanyExtendedByIdAction) => ({
    ...state,
    ...Object.keys(payload).reduce((obj, key) => ({...obj, [key]: false}), {}),
  }),
  ['mvj/tradeRegister/COMPANY_EXTENDED_NOT_FOUND_BY_ID']: (state: TradeRegisterIsFetchingMap, {payload: businessId}: CompanyExtendedNotFoundByIdAction) => ({
    ...state,
    [businessId]: false,
  }),
}, {});

const companyExtendedByIdReducer: Reducer<TradeRegisterDataMap> = handleActions({
  ['mvj/tradeRegister/RECEIVE_COMPANY_EXTENDED_BY_ID']: (state: TradeRegisterDataMap, {payload}: ReceiveTradeRegisterCompanyExtendedByIdAction) => ({
    ...state,
    ...payload,
  }),
}, {});

const collapseStatesReducer: Reducer<Object> = handleActions({
  ['mvj/tradeRegister/RECEIVE_COLLAPSE_STATES']: (state: Object, {payload: states}: ReceiveCollapseStatesAction) => ({
    ...state,
    ...states,
  }),
}, {});

export default combineReducers<Object, any>({
  collapseStates: collapseStatesReducer,
  companyExtendedById: companyExtendedByIdReducer,
  isFetchingCompanyExtendedById: isFetchingCompanyExtendedByIdReducer,
});
