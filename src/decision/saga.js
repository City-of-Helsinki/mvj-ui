// @flow

import {takeLatest} from 'redux-saga';
import {call, fork, put} from 'redux-saga/effects';

import {
  notFound,
  receiveDecisionsByLease,
} from './actions';
import {fetchDecisions} from './requests';
import {receiveError} from '../api/actions';

function* fetchDecisionsByLeaseSaga({payload: leaseId}): Generator<any, any, any> {
  try {
    let {response: {status: statusCode}, bodyAsJson: body} = yield call(fetchDecisions, `?lease=${leaseId}`);
    let decisions = body.results;
    while(statusCode === 200 && body.next) {
      const {response: {status}, bodyAsJson} = yield call(fetchDecisions, `?${body.next.split('?').pop()}`);
      statusCode = status;
      body = bodyAsJson;
      decisions = [...decisions, ...body.results];
    }

    switch (statusCode) {
      case 200:
        yield put(receiveDecisionsByLease({leaseId: leaseId, decisions: decisions}));
        break;
      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch decisions by lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield [
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/decision/FETCH_BY_LEASE', fetchDecisionsByLeaseSaga);
    }),
  ];
}
