// @flow

import {takeLatest} from 'redux-saga';
import {call, fork, put} from 'redux-saga/effects';

import {receiveAttributes, notFound} from './actions';
import {fetchAttributes} from './requests';
import {receiveError} from '../api/actions';

function* fetchAttributesSaga(): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttributes);
    const types = bodyAsJson.actions && bodyAsJson.actions.POST;

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

export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/attribute/FETCH', fetchAttributesSaga);
    }),
  ];
}
