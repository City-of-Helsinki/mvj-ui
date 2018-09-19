// @flow
import {all, call, fork, put, takeEvery} from 'redux-saga/effects';

import {
  receivePreviewInvoices,
} from './actions';
import {receiveError} from '$src/api/actions';
import {fetchPreviewInvoices} from './requests';


function* fetchPreviewInvoicesSaga({payload}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchPreviewInvoices, payload);

    switch (statusCode) {
      case 200:
        yield put(receivePreviewInvoices(bodyAsJson));
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
      yield takeEvery('mvj/previewInvoices/FETCH_ALL', fetchPreviewInvoicesSaga);
    }),
  ]);
}
