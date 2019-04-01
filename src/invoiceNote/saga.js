// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';

import {receiveError} from '$src/api/actions';
import {
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  receiveInvoiceNoteList,
  notFound,
} from './actions';
import {
  fetchAttributes,
  fetchInvoiceNotes,
} from './requests';

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttributes);

    switch (statusCode) {
      case 200:
        const attributes = bodyAsJson.fields || null;
        const methods = bodyAsJson.methods || null;

        yield put(receiveAttributes(attributes));
        yield put(receiveMethods(methods));
        break;
      default:
        yield put(attributesNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch invoice note attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchInvoiceNotesSaga({payload: query}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchInvoiceNotes, query);

    switch (statusCode) {
      case 200:
        yield put(receiveInvoiceNoteList(bodyAsJson));
        break;
      default:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch invoice notes with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/invoiceNote/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/invoiceNote/FETCH_ALL', fetchInvoiceNotesSaga);
    }),
  ]);
}
