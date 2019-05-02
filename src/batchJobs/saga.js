// @flow
import {all, fork, put, takeLatest} from 'redux-saga/effects';

import {receiveError} from '$src/api/actions';
import {
  notFoundBatchRuns,
  notFoundBatchSchedules,
} from '$src/batchJobs/actions';

function* fetchBatchRunsSaga({payload: query}): Generator<any, any, any> {
  try {
    console.log(query);
  } catch (error) {
    console.error('Failed to fetch batch runs with error "%s"', error);
    yield put(notFoundBatchRuns());
    yield put(receiveError(error));
  }
}

function* fetchBatchSchedulesSaga({payload: query}): Generator<any, any, any> {
  try {
    console.log(query);
  } catch (error) {
    console.error('Failed to fetch batch schedules with error "%s"', error);
    yield put(notFoundBatchSchedules());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/batchJobs/FETCH_BATCH_RUNS', fetchBatchRunsSaga);
      yield takeLatest('mvj/batchJobs/FETCH_BATCH_SCHEDULES', fetchBatchSchedulesSaga);
    }),
  ]);
}
