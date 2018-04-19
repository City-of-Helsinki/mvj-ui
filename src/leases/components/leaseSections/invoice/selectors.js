// @flow

import type {Selector} from '$src/types';
import type {BillingState} from './types';
import get from 'lodash/get';

export const getBilling: Selector<Object, void> = (state: BillingState): Object =>
  state.invoice.billing;

export const getEditInvoiceFormErrors: Selector<Object, void> = (state: BillingState): Object =>
  get(state, 'form.edit-invoice-form.syncErrors');

export const getEditInvoiceFormValues: Selector<Object, void> = (state: BillingState): Object =>
  get(state, 'form.edit-invoice-form.values');

export const getNewBillFormErrors: Selector<Object, void> = (state: BillingState): Object =>
  get(state, 'form.billing-new-bill-form.syncErrors');

export const getNewBillFormValues: Selector<Object, void> = (state: BillingState): Object =>
  get(state, 'form.billing-new-bill-form.values');
