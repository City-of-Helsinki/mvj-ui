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
