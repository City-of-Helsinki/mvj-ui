// @flow

import {takeLatest} from 'redux-saga';
import {fork, put} from 'redux-saga/effects';
import {displayUIMessage} from '$util/helpers';

import {
  receiveBill,
  receiveEditedBill,
} from './actions';

function* createBillSaga({payload: bill}): Generator<> {
  yield put(receiveBill(bill));
  displayUIMessage({title: 'Lasku tallennettu', body: 'Lasku on tallennettu onnistuneesti'});
}

function* editBillSaga({payload: bill}): Generator<> {
  yield put(receiveEditedBill(bill));
  displayUIMessage({title: 'Lasku tallennettu', body: 'Lasku on tallennettu onnistuneesti'});
}

function* refundBillSaga({payload: bill}): Generator<> {
  bill.invoice_type = '1';
  bill.status = '2';
  bill.unpaid_amount = 0;

  yield put(receiveEditedBill(bill));
  displayUIMessage({title: 'Lasku hyvitetty', body: 'Lasku on hyvitetty onnistuneesti'});
}

export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/billing/CREATE_BILL', createBillSaga);
      yield takeLatest('mvj/billing/EDIT_BILL', editBillSaga);
      yield takeLatest('mvj/billing/REFUND_BILL', refundBillSaga);
    }),
  ];
}
