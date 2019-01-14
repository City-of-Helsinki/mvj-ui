// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';

import {
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  notFound,
  receivePreviewInvoices,
} from './actions';
import {receiveError} from '$src/api/actions';
import {fetchAttributes, fetchPreviewInvoices} from './requests';

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
    console.error('Failed to fetch preview invoices attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchPreviewInvoicesSaga({payload}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchPreviewInvoices, payload);

    switch (statusCode) {
      case 200:
        yield put(receivePreviewInvoices(bodyAsJson));
        break;
      default:
        yield put(receiveError({...bodyAsJson}));
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch collection letters by lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/previewInvoices/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/previewInvoices/FETCH_ALL', fetchPreviewInvoicesSaga);
    }),
  ]);
}
