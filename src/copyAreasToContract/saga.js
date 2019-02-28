// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';

import {
  receiveMethods,
  attributesNotFound,
} from './actions';
import {fetchAttributes} from './requests';
import {receiveError} from '../api/actions';

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttributes);

    switch (statusCode) {
      case 200:
        const methods = bodyAsJson.methods;

        yield put(receiveMethods(methods));
        break;
      default:
        yield put(attributesNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch copy areas to contract attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/copyAreasToContract/FETCH_ATTRIBUTES', fetchAttributesSaga);
    }),
  ]);
}
