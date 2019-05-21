// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';

import {receiveError} from '$src/api/actions';
import {
  notFoundBatchRuns,
  notFoundBatchSchedules,
  notFoundJobRunAttributes,
  notFoundJobRunLogEntryAttributes,
  notFoundScheduledJobAttributes,
  receiveJobRunAttributes,
  receiveJobRunMethods,
  receiveJobRunLogEntryAttributes,
  receiveJobRunLogEntryMethods,
  receiveScheduledJobAttributes,
  receiveScheduledJobMethods,
} from '$src/batchrun/actions';
import {
  fetchJobRunAttributes,
  fetchJobRunLogEntryAttributes,
  fetchScheduledJobAttributes,
} from '$src/batchrun/requests';

function* fetchJobRunAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchJobRunAttributes);

    switch (statusCode) {
      case 200:
        const attributes = bodyAsJson.fields || {};
        const methods = bodyAsJson.methods || {};

        yield put(receiveJobRunAttributes(attributes));
        yield put(receiveJobRunMethods(methods));
        break;
      default:
        yield put(notFoundJobRunAttributes());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch batchrun job run attributes with error "%s"', error);
    yield put(notFoundJobRunAttributes());
    yield put(receiveError(error));
  }
}

function* fetchJobRunLogEntryAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchJobRunLogEntryAttributes);

    switch (statusCode) {
      case 200:
        const attributes = bodyAsJson.fields || {};
        const methods = bodyAsJson.methods || {};

        yield put(receiveJobRunLogEntryAttributes(attributes));
        yield put(receiveJobRunLogEntryMethods(methods));
        break;
      default:
        yield put(notFoundJobRunLogEntryAttributes());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch batchrun job run log entry attributes with error "%s"', error);
    yield put(notFoundJobRunLogEntryAttributes());
    yield put(receiveError(error));
  }
}

function* fetchScheduledJobAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchScheduledJobAttributes);

    switch (statusCode) {
      case 200:
        const attributes = bodyAsJson.fields || {};
        const methods = bodyAsJson.methods || {};

        yield put(receiveScheduledJobAttributes(attributes));
        yield put(receiveScheduledJobMethods(methods));
        break;
      default:
        yield put(notFoundScheduledJobAttributes());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch batchrun scheduled job attributes with error "%s"', error);
    yield put(notFoundScheduledJobAttributes());
    yield put(receiveError(error));
  }
}

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
      yield takeLatest('mvj/batchrun/FETCH_JOB_RUN_ATTRIBUTES', fetchJobRunAttributesSaga);
      yield takeLatest('mvj/batchrun/FETCH_JOB_RUN_LOG_ENTRY_ATTRIBUTES', fetchJobRunLogEntryAttributesSaga);
      yield takeLatest('mvj/batchrun/FETCH_SCHEDULED_JOB_ATTRIBUTES', fetchScheduledJobAttributesSaga);
      yield takeLatest('mvj/batchrun/FETCH_BATCH_RUNS', fetchBatchRunsSaga);
      yield takeLatest('mvj/batchrun/FETCH_BATCH_SCHEDULES', fetchBatchSchedulesSaga);
    }),
  ]);
}
