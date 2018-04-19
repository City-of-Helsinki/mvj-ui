// @flow

import type {Selector} from '../types';

import type {
  Attributes,
  InvoiceState,
} from './types';

export const getAttributes: Selector<Attributes, void> = (state: InvoiceState): InvoiceState =>
  state.invoice.attributes;
