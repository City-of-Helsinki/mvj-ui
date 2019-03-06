// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  SapInvoiceList,
  ReceiveSapInvoicesAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/sapInvoice/FETCH_ALL': () => true,
  'mvj/sapInvoice/RECEIVE_ALL': () => false,
  'mvj/sapInvoice/NOT_FOUND': () => false,
}, false);

const listReducer: Reducer<SapInvoiceList> = handleActions({
  ['mvj/sapInvoice/RECEIVE_ALL']: (state: SapInvoiceList, {payload: sapInvoiceList}: ReceiveSapInvoicesAction) => {
    return sapInvoiceList;
  },
}, {});

export default combineReducers<Object, any>({
  isFetching: isFetchingReducer,
  list: listReducer,
});
