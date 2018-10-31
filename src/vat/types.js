// @flow
import type {Action} from '../types';

export type VatState = {
  isFetching: boolean,
  list: VatList,
};

export type VatList = Array<Object>;

export type FetchVatsAction = Action<'mvj/vat/FETCH_ALL', void>;
export type ReceiveVatsAction = Action<'mvj/vat/RECEIVE_ALL', VatList>;
export type VatsNotFoundAction = Action<'mvj/vat/NOT_FOUND', void>;
