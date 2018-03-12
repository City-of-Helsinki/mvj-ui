// @flow

import type {Selector} from '$src/types';
import type {BillingState} from './types';
import get from 'lodash/get';

export const getBilling: Selector<Object, void> = (state: BillingState): Object =>
  state.billing.billing;

export const getEditAbnormalDebtFormErrors: Selector<Object, void> = (state: BillingState): Object =>
  get(state, 'form.billing-edit-abnormal-debt-form.syncErrors');

export const getEditAbnormalDebtFormValues: Selector<Object, void> = (state: BillingState): Object =>
  get(state, 'form.billing-edit-abnormal-debt-form.values');

export const getEditBillFormErrors: Selector<Object, void> = (state: BillingState): Object =>
  get(state, 'form.billing-edit-bill-form.syncErrors');

export const getEditBillFormValues: Selector<Object, void> = (state: BillingState): Object =>
  get(state, 'form.billing-edit-bill-form.values');

export const getNewBillFormErrors: Selector<Object, void> = (state: BillingState): Object =>
  get(state, 'form.billing-new-bill-form.syncErrors');

export const getNewBillFormValues: Selector<Object, void> = (state: BillingState): Object =>
  get(state, 'form.billing-new-bill-form.values');
