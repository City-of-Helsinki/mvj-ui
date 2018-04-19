// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '$src/types';
import type {
  Billing,
  ReceiveBillAction,
  ReceiveEditedBillAction,
} from './types';

const receiveBillingReducer: Reducer<Billing> = handleActions({
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
}, {});

export default combineReducers({
  billing: receiveBillingReducer,
});
