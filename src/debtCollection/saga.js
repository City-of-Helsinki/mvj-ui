// @flow
import {all, fork, put, takeLatest} from 'redux-saga/effects';

import {
  receiveCollectionCostsByInvoice,
} from './actions';
import {receiveError} from '$src/api/actions';


function* fetchCollectionCostsByInvoiceSaga({payload: invoiceId}): Generator<any, any, any> {
  try {
    const collectionCosts = {
      fee_payment: 5600,
      interest: 150,
      collection_fee: 5,
    };
    yield put(receiveCollectionCostsByInvoice({invoiceId: invoiceId, collectionCosts: collectionCosts}));
  } catch (error) {
    console.error('Failed to collection costs by invoice with error "%s"', error);
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/debtCollection/FETCH_COLLECTION_COSTS_BY_INVOICE', fetchCollectionCostsByInvoiceSaga);
    }),
  ]);
}
