// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '$src/types';
import type {
  Billing,
  ReceiveAbnormalDebtAction,
  ReceiveBillAction,
  ReceiveEditedBillAction,
  ReceiveBillingAction,
  ReceiveInvoicingStatusAction,
} from './types';

const receiveBillingReducer: Reducer<Billing> = handleActions({
  ['mvj/billing/RECEIVE_ABNORMAL_DEBT']: (state: Billing, {payload: bill}: ReceiveAbnormalDebtAction) => {
    const bills = [...state.abnormal_debts, bill];
    state.abnormal_debts = bills;
    return state;
  },
  ['mvj/billing/RECEIVE_BILL']: (state: Billing, {payload: bill}: ReceiveBillAction) => {
    const bills = [...state.bills, bill];
    state.bills = bills;
    return state;
  },
  ['mvj/billing/RECEIVE_EDITED_BILL']: (state: Billing, {payload: bill}: ReceiveEditedBillAction) => {
    const bills = state.bills;
    bills[bill.arrayIndex] = bill;
    state.bills = bills;
    return state;
  },
  ['mvj/billing/RECEIVE_BILLING']: (state: Billing, {payload: billing}: ReceiveBillingAction) => {
    return billing;
  },
  ['mvj/billing/RECEIVE_INVOICING_STATUS']: (state: Billing, {payload: status}: ReceiveInvoicingStatusAction) => {
    state.invoicing_started = status;
    return state;
  },
}, {});

export default combineReducers({
  billing: receiveBillingReducer,
});
