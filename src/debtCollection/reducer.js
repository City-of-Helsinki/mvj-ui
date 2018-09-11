// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '$src/types';
import type {
  FetchCollectionCostsByInvoiceAction,
  ReceiveCollectionCostsByInvoiceAction,
  CollectionCostsNotFoundByInvoiceAction,
} from '$src/debtCollection/types';

const isFetchingCollectionCostsByInvoiceReducer: Reducer<Object> = handleActions({
  ['mvj/debtCollection/FETCH_COLLECTION_COSTS_BY_INVOICE']: (state: Object, {payload: invoice}: FetchCollectionCostsByInvoiceAction) => {
    return {
      ...state,
      [invoice]: true,
    };
  },
  ['mvj/debtCollection/RECEIVE_COLLECTION_COSTS_BY_INVOICE']: (state: Object, {payload}: ReceiveCollectionCostsByInvoiceAction) => {
    return {
      ...state,
      [payload.invoiceId]: false,
    };
  },
  ['mvj/debtCollection/COLLECTION_COSTS_NOT_FOUND_BY_INVOICE']: (state: Object, {payload: invoice}: CollectionCostsNotFoundByInvoiceAction) => {
    return {
      ...state,
      [invoice]: false,
    };
  },
}, {});

const collectionCostsByInvoiceReducer: Reducer<Object> = handleActions({
  ['mvj/debtCollection/RECEIVE_COLLECTION_COSTS_BY_INVOICE']: (state: Object, {payload}: ReceiveCollectionCostsByInvoiceAction) => {
    return {
      ...state,
      [payload.invoiceId]: payload.collectionCosts,
    };
  },
}, {});

export default combineReducers({
  collectionCostsByInvoice: collectionCostsByInvoiceReducer,
  isFetchingCollectionCostsByInvoice: isFetchingCollectionCostsByInvoiceReducer,
});
