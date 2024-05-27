import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { receiveError } from "src/api/actions";
import { receiveAuditLogByContact, notFoundByContact, receiveAuditLogByLease, notFoundByLease, receiveAuditLogByAreaSearch, notFoundByAreaSearch } from "./actions";
import { fetchAuditLog } from "./requests";

function* fetchAuditLogByContactSaga({
  payload,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchAuditLog, { ...payload,
      type: 'contact'
    });

    switch (statusCode) {
      case 200:
        yield put(receiveAuditLogByContact({
          [payload.id.toString()]: bodyAsJson
        }));
        break;

      default:
        console.error('Failed to fetch contact audit log');
        yield put(notFoundByContact(payload.id));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch contact audit log with error "%s"', error);
    yield put(notFoundByContact(payload.id));
    yield put(receiveError(error));
  }
}

function* fetchAuditLogByLeaseSaga({
  payload,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchAuditLog, { ...payload,
      type: 'lease'
    });

    switch (statusCode) {
      case 200:
        yield put(receiveAuditLogByLease({
          [payload.id.toString()]: bodyAsJson
        }));
        break;

      default:
        console.error('Failed to fetch lease audit log');
        yield put(notFoundByLease(payload.id));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch lease audit log with error "%s"', error);
    yield put(notFoundByLease(payload.id));
    yield put(receiveError(error));
  }
}

function* fetchAuditLogByAreaSearchSaga({
  payload,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchAuditLog, { ...payload,
      type: 'areasearch'
    });

    switch (statusCode) {
      case 200:
        yield put(receiveAuditLogByAreaSearch({
          [payload.id.toString()]: bodyAsJson
        }));
        break;

      default:
        console.error('Failed to fetch areasearch audit log');
        yield put(notFoundByAreaSearch(payload.id));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch areasearch audit log with error "%s"', error);
    yield put(notFoundByAreaSearch(payload.id));
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/auditLog/FETCH_BY_CONTACT', fetchAuditLogByContactSaga);
    yield takeLatest('mvj/auditLog/FETCH_BY_LEASE', fetchAuditLogByLeaseSaga);
    yield takeLatest('mvj/auditLog/FETCH_BY_AREASEARCH', fetchAuditLogByAreaSearchSaga);
  })]);
}