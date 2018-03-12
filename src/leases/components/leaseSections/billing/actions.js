// @flow

import {createAction} from 'redux-actions';

import type {
  Bill,
  BillId,
  Billing,
  CreateBillAction,
  EditBillAction,
  RefundBillAction,
  ReceiveBillAction,
  ReceiveEditedBillAction,
  CreateAbnormalDebtAction,
  DeleteAbnormalDebtAction,
  EditAbnormalDebtAction,
  ReceiveAbnormalDebtAction,
  ReceiveBillingAction,
  ReceiveInvoicingStatusAction,
  StartInvoicingAction,
  StopInvoicingAction,
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

export const createAbnormalDebt = (bill: Bill): CreateAbnormalDebtAction =>
  createAction('mvj/billing/CREATE_ABNORMAL_DEBT')(bill);

export const deleteAbnormalDebt = (billId: BillId): DeleteAbnormalDebtAction =>
  createAction('mvj/billing/DELETE_ABNORMAL_DEBT')(billId);

export const editAbnormalDebt = (bill: Bill, billId: BillId): EditAbnormalDebtAction =>
  createAction('mvj/billing/EDIT_ABNORMAL_DEBT')(bill, billId);

export const receiveAbnormalDebt = (bill: Bill): ReceiveAbnormalDebtAction =>
  createAction('mvj/billing/RECEIVE_ABNORMAL_DEBT')(bill);

export const receiveBilling = (billing: Billing): ReceiveBillingAction =>
  createAction('mvj/billing/RECEIVE_BILLING')(billing);

export const receiveInvoicingStatus = (status: boolean): ReceiveInvoicingStatusAction =>
  createAction('mvj/billing/RECEIVE_INVOICING_STATUS')(status);

export const startInvoicing = (): StartInvoicingAction =>
  createAction('mvj/billing/START_INVOICING')();

export const stopInvoicing = (): StopInvoicingAction =>
  createAction('mvj/billing/STOP_INVOICING')();
