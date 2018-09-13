// @flow
import {all, call, fork, put, takeEvery} from 'redux-saga/effects';

import {
  receivePenaltyInterestByInvoice,
} from './actions';
import {receiveError} from '$src/api/actions';
import {fetchPenaltyInterestByInvoice} from './requests';


function* fetchPenaltyInterestByInvoiceSaga({payload: invoiceId}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchPenaltyInterestByInvoice, invoiceId);

    switch (statusCode) {
      case 200:
        yield put(receivePenaltyInterestByInvoice({invoiceId: invoiceId, penaltyInterest: bodyAsJson}));
        break;
      default:
        break;
    }
  } catch (error) {
    console.error('Failed to fetch collection letters by lease with error "%s"', error);
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeEvery('mvj/penaltyInterest/FETCH_BY_INVOICE', fetchPenaltyInterestByInvoiceSaga);
    }),
  ]);
}
