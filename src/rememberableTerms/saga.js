// @flow
import {all, fork, put, takeLatest} from 'redux-saga/effects';

import mockData from './mock-data.json';
import {receiveRememberableTermList} from './actions';

function* fetchRememberableTermListSaga({payload: search}): Generator<any, any, any> {
  console.log('FetchRememberableTermListSaga: ', search);
  yield put(receiveRememberableTermList(mockData));
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/rememberableterm/FETCH_ALL', fetchRememberableTermListSaga);
    }),
  ]);
}
