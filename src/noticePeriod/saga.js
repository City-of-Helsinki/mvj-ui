// @flow

import {takeLatest} from 'redux-saga';
import {call, fork, put} from 'redux-saga/effects';

import {
  notFound,
  receiveNoticePeriods,
} from './actions';
import {fetchNoticePeriods} from './requests';
import {receiveError} from '../api/actions';

function* fetchNoticePeriodsSaga({payload: search}): Generator<> {
  try {
    let {response: {status: statusCode}, bodyAsJson: body} = yield call(fetchNoticePeriods, search);
    let noticePeriods = body.results;
    while(statusCode === 200 && body.next) {
      const {response: {status}, bodyAsJson} = yield call(fetchNoticePeriods, `?${body.next.split('?').pop()}`);
      statusCode = status;
      body = bodyAsJson;
      noticePeriods = [...noticePeriods, ...body.results];
    }

    switch (statusCode) {
      case 200:
        yield put(receiveNoticePeriods(noticePeriods));
        break;
      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch leases with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/noticePeriod/FETCH_ALL', fetchNoticePeriodsSaga);
    }),
  ];
}
