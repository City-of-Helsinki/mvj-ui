// @flow

import {createAction} from 'redux-actions';

import type {
  Bill,
  CreateBillAction,
  EditBillAction,
  RefundBillAction,
  ReceiveBillAction,
  ReceiveEditedBillAction,
} from './types';

export const createBill = (bill: Bill): CreateBillAction =>
  createAction('mvj/billing/CREATE_BILL')(bill);

export const editBill = (bill: Bill): EditBillAction =>
  createAction('mvj/billing/EDIT_BILL')(bill);

export const refundBill = (bill: Bill): RefundBillAction =>
  createAction('mvj/billing/REFUND_BILL')(bill);

export const receiveBill = (bill: Bill): ReceiveBillAction =>
  createAction('mvj/billing/RECEIVE_BILL')(bill);

export const receiveEditedBill = (bill: Bill): ReceiveEditedBillAction =>
  createAction('mvj/billing/RECEIVE_EDITED_BILL')(bill);
