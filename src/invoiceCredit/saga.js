// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';

import {
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
} from './actions';
import {receiveError} from '$src/api/actions';
import {fetchAttributes} from './requests';

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
    console.error('Failed to fetch invoice credit attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/invoiceCredit/FETCH_ATTRIBUTES', fetchAttributesSaga);
    }),
  ]);
}
