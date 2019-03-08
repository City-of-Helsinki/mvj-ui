// @flow
import {createAction} from 'redux-actions';

import type {
  TradeRegisterDataMap,
  FetchTradeRegisterCompanyExtendedByIdAction,
  ReceiveTradeRegisterCompanyExtendedByIdAction,
  CompanyExtendedNotFoundByIdAction,
  ReceiveCollapseStatesAction,
} from '$src/tradeRegister/types';

export const fetchTradeRegisterCompanyExtendedById = (businessId: string): FetchTradeRegisterCompanyExtendedByIdAction =>
  createAction('mvj/tradeRegister/FETCH_COMPANY_EXTENDED_BY_ID')(businessId);

export const receiveTradeRegisterCompanyExtendedById = (payload: TradeRegisterDataMap): ReceiveTradeRegisterCompanyExtendedByIdAction =>
  createAction('mvj/tradeRegister/RECEIVE_COMPANY_EXTENDED_BY_ID')(payload);

export const companyExtendedNotFoundById = (businessId: string): CompanyExtendedNotFoundByIdAction =>
  createAction('mvj/tradeRegister/COMPANY_EXTENDED_NOT_FOUND_BY_ID')(businessId);

export const receiveCollapseStates = (status: Object): ReceiveCollapseStatesAction =>
  createAction('mvj/tradeRegister/RECEIVE_COLLAPSE_STATES')(status);
