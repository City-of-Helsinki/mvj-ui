// @flow
import {all, fork, put, takeLatest} from 'redux-saga/effects';

import {
  receiveInfillDevelopments,
  receiveSingleInfillDevelopment,
} from './actions';
import mockData from './mock-data.json';

function* fetchInfillDevelopmentsSaga({payload: search}): Generator<any, any, any> {
  console.log(search);
  const bodyAsJson = mockData;
  const list = {
    count: 1,
    results: bodyAsJson,
  };
  yield put(receiveInfillDevelopments(list));
}

function* fetchSingleInfillDevelopmentSaga({payload: id}): Generator<any, any, any> {
  console.log(id);
  const bodyAsJson = mockData[0];
  yield put(receiveSingleInfillDevelopment(bodyAsJson));
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/infillDevelopment/FETCH_ALL', fetchInfillDevelopmentsSaga);
      yield takeLatest('mvj/infillDevelopment/FETCH_SINGLE', fetchSingleInfillDevelopmentSaga);
    }),
  ]);
}
