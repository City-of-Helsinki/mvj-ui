// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';

import {receiveAttributes, notFound} from './actions';
import {fetchAttributes} from './requests';
import {receiveError} from '../api/actions';

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttributes);
    const types = bodyAsJson.fields;

    switch (statusCode) {
      case 200:
        yield put(receiveAttributes(types));
        break;
      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch attributes with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/attribute/FETCH', fetchAttributesSaga);
    }),
  ]);
}
