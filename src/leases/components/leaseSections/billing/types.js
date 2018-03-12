// @flow

import type {Action} from '$src/types';

export type BillingState = Object;
export type Billing = Object;
export type Bill = Object;
export type BillId = number;

export type CreateBillAction = Action<'mvj/billing/CREATE_BILL', Bill>;
export type EditBillAction = Action<'mvj/billing/EDIT_BILL', Bill>;
export type RefundBillAction = Action<'mvj/billing/REFUND_BILL', Bill>;
export type ReceiveBillAction = Action<'mvj/billing/RECEIVE_BILL', Bill>;
export type ReceiveEditedBillAction = Action<'mvj/billing/RECEIVE_EDITED_BILL', Bill>;

export type CreateAbnormalDebtAction = Action<'mvj/billing/CREATE_ABNORMAL_DEBT', Bill>;
export type DeleteAbnormalDebtAction = Action<'mvj/billing/DELETE_ABNORMAL_DEBT', BillId>;
export type EditAbnormalDebtAction = Action<'mvj/billing/EDIT_ABNORMAL_DEBT', Bill>;
export type ReceiveAbnormalDebtAction = Action<'mvj/billing/RECEIVE_ABNORMAL_DEBT', Bill>;
export type ReceiveEditedAbnormalDebtAction = Action<'mvj/billing/RECEIVE_EDITED_ABNORMAL_DEBT', Bill>;

export type ReceiveBillingAction = Action<'mvj/billing/RECEIVE_BILLING', Billing>;

export type ReceiveInvoicingStatusAction = Action<'mvj/billing/RECEIVE_INVOICING_STATUS', boolean>;
export type StartInvoicingAction = Action<'mvj/billing/START_INVOICING', void>;
export type StopInvoicingAction = Action<'mvj/billing/STOP_INVOICING', void>;
