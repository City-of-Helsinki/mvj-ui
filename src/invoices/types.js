// @flow

import type {Action} from '../types';

export type InvoiceState = Object;
export type Attributes = Object;

export type FetchAttributesAction = Action<'mvj/invoices/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/invoices/RECEIVE_ATTRIBUTES', Attributes>;
