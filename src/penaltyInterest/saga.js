// @flow
import {all, call, fork, put, takeEvery} from 'redux-saga/effects';

import {
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  receivePenaltyInterestByInvoice,
  penaltyInterestNotFoundByInvoice,
} from './actions';
import {receiveError} from '$src/api/actions';
import {fetchAttributes, fetchPenaltyInterestByInvoice} from './requests';

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttributes);

    switch (statusCode) {
      case 200:
        const attributes = bodyAsJson.fields;
        const methods = bodyAsJson.methods;

        yield put(receiveAttributes(attributes));
        yield put(receiveMethods(methods));
        break;
      default:
        yield put(attributesNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch set invoicing state attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchPenaltyInterestByInvoiceSaga({payload: invoiceId}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchPenaltyInterestByInvoice, invoiceId);

    switch (statusCode) {
      case 200:
        yield put(receivePenaltyInterestByInvoice({invoiceId: invoiceId, penaltyInterest: bodyAsJson}));
        break;
      default:
        yield put(penaltyInterestNotFoundByInvoice(invoiceId));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch penalty interest by lease with error "%s"', error);
    yield put(penaltyInterestNotFoundByInvoice(invoiceId));
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeEvery('mvj/penaltyInterest/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeEvery('mvj/penaltyInterest/FETCH_BY_INVOICE', fetchPenaltyInterestByInvoiceSaga);
    }),
  ]);
}
