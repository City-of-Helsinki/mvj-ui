import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { receiveError } from "@/api/slice";
import {
  fetchJobRunAttributes as fetchJobRunAttributesAction,
  fetchJobRuns as fetchJobRunsAction,
  fetchJobRunLogEntryAttributes as fetchJobRunLogEntryAttributesAction,
  fetchJobRunLogEntriesByRun as fetchJobRunLogEntriesByRunAction,
  fetchScheduledJobAttributes as fetchScheduledJobAttributesAction,
  fetchScheduledJobs as fetchScheduledJobsAction,
  notFoundJobRuns,
  notFoundJobRunAttributes,
  notFoundJobRunLogEntryAttributes,
  notFoundJobRunLogEntriesByRun,
  notFoundScheduledJobAttributes,
  notFoundScheduledJobs,
  receiveJobRunAttributes,
  receiveJobRunMethods,
  receiveJobRuns,
  receiveJobRunLogEntryAttributes,
  receiveJobRunLogEntryMethods,
  receiveJobRunLogEntriesByRun,
  receiveScheduledJobAttributes,
  receiveScheduledJobMethods,
  receiveScheduledJobs,
} from "@/batchrun/slice";
import {
  fetchJobRunAttributes,
  fetchJobRuns,
  fetchJobRunLogEntryAttributes,
  fetchJobRunLogEntries,
  fetchScheduledJobAttributes,
  fetchScheduledJobs,
} from "@/batchrun/requests";

function* fetchJobRunAttributesSaga(): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchJobRunAttributes);

    switch (statusCode) {
      case 200: {
        const attributes = bodyAsJson.fields || {};
        const methods = bodyAsJson.methods || {};
        yield put(receiveJobRunAttributes(attributes));
        yield put(receiveJobRunMethods(methods));
        break;
      }

      default:
        yield put(notFoundJobRunAttributes());
        break;
    }
  } catch (error) {
    console.error(
      'Failed to fetch batchrun job run attributes with error "%s"',
      error,
    );
    yield put(notFoundJobRunAttributes());
    yield put(receiveError(error));
  }
}

function* fetchJobRunsSaga({
  payload: query,
}: ReturnType<typeof fetchJobRunsAction>): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchJobRuns, query);

    switch (statusCode) {
      case 200:
        yield put(receiveJobRuns(bodyAsJson));
        break;

      case 404:
      case 500:
        yield put(notFoundJobRuns());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch job runs with error "%s"', error);
    yield put(notFoundJobRuns());
    yield put(receiveError(error));
  }
}

function* fetchJobRunLogEntryAttributesSaga(): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchJobRunLogEntryAttributes);

    switch (statusCode) {
      case 200: {
        const attributes = bodyAsJson.fields || {};
        const methods = bodyAsJson.methods || {};
        yield put(receiveJobRunLogEntryAttributes(attributes));
        yield put(receiveJobRunLogEntryMethods(methods));
        break;
      }

      default:
        yield put(notFoundJobRunLogEntryAttributes());
        break;
    }
  } catch (error) {
    console.error(
      'Failed to fetch batchrun job run log entry attributes with error "%s"',
      error,
    );
    yield put(notFoundJobRunLogEntryAttributes());
    yield put(receiveError(error));
  }
}

function* fetchJobRunLogEntriesByRunSaga({
  payload: run,
}: ReturnType<typeof fetchJobRunLogEntriesByRunAction>): Generator<
  any,
  any,
  any
> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchJobRunLogEntries, {
      run: run,
      limit: 10000,
    });

    switch (statusCode) {
      case 200:
        yield put(
          receiveJobRunLogEntriesByRun({
            run: run,
            data: bodyAsJson,
          }),
        );
        break;

      case 404:
      case 500:
        yield put(notFoundJobRunLogEntriesByRun(run));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch job run log entries with error "%s"', error);
    yield put(notFoundJobRunLogEntriesByRun(run));
    yield put(receiveError(error));
  }
}

function* fetchScheduledJobAttributesSaga(): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchScheduledJobAttributes);

    switch (statusCode) {
      case 200: {
        const attributes = bodyAsJson.fields || {};
        const methods = bodyAsJson.methods || {};
        yield put(receiveScheduledJobAttributes(attributes));
        yield put(receiveScheduledJobMethods(methods));
        break;
      }

      default:
        yield put(notFoundScheduledJobAttributes());
        break;
    }
  } catch (error) {
    console.error(
      'Failed to fetch batchrun scheduled job attributes with error "%s"',
      error,
    );
    yield put(notFoundScheduledJobAttributes());
    yield put(receiveError(error));
  }
}

function* fetchScheduledJobsSaga({
  payload: query,
}: ReturnType<typeof fetchScheduledJobsAction>): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchScheduledJobs, query);

    switch (statusCode) {
      case 200:
        yield put(receiveScheduledJobs(bodyAsJson));
        break;

      case 404:
      case 500:
        yield put(notFoundScheduledJobs());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch scheduled jobs with error "%s"', error);
    yield put(notFoundScheduledJobs());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([
    fork(function* (): Generator<any, any, any> {
      yield takeLatest(fetchJobRunAttributesAction, fetchJobRunAttributesSaga);
      yield takeLatest(
        fetchJobRunLogEntryAttributesAction,
        fetchJobRunLogEntryAttributesSaga,
      );
      yield takeLatest(
        fetchScheduledJobAttributesAction,
        fetchScheduledJobAttributesSaga,
      );
      yield takeLatest(fetchJobRunsAction, fetchJobRunsSaga);
      yield takeLatest(
        fetchJobRunLogEntriesByRunAction,
        fetchJobRunLogEntriesByRunSaga,
      );
      yield takeLatest(fetchScheduledJobsAction, fetchScheduledJobsSaga);
    }),
  ]);
}
