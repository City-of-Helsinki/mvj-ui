import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { receiveError } from "@/api/slice";
import {
  fetchAuditLogByContact,
  receiveAuditLogByContact,
  notFoundByContact,
  fetchAuditLogByLease,
  receiveAuditLogByLease,
  notFoundByLease,
  fetchAuditLogByAreaSearch,
  receiveAuditLogByAreaSearch,
  notFoundByAreaSearch,
} from "./slice";
import { fetchAuditLog } from "./requests";

function* fetchAuditLogByContactSaga({
  payload,
}: ReturnType<typeof fetchAuditLogByContact>): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchAuditLog, { ...payload, type: "contact" });

    switch (statusCode) {
      case 200:
        yield put(
          receiveAuditLogByContact({
            [payload.id.toString()]: bodyAsJson,
          }),
        );
        break;

      default:
        console.error("Failed to fetch contact audit log");
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
}: ReturnType<typeof fetchAuditLogByLease>): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchAuditLog, { ...payload, type: "lease" });

    switch (statusCode) {
      case 200:
        yield put(
          receiveAuditLogByLease({
            [payload.id.toString()]: bodyAsJson,
          }),
        );
        break;

      default:
        console.error("Failed to fetch lease audit log");
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
}: ReturnType<typeof fetchAuditLogByAreaSearch>): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchAuditLog, { ...payload, type: "areasearch" });

    switch (statusCode) {
      case 200:
        yield put(
          receiveAuditLogByAreaSearch({
            [payload.id.toString()]: bodyAsJson,
          }),
        );
        break;

      default:
        console.error("Failed to fetch areasearch audit log");
        yield put(notFoundByAreaSearch(payload.id));
        break;
    }
  } catch (error) {
    console.error(
      'Failed to fetch areasearch audit log with error "%s"',
      error,
    );
    yield put(notFoundByAreaSearch(payload.id));
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([
    fork(function* (): Generator<any, any, any> {
      yield takeLatest(fetchAuditLogByContact, fetchAuditLogByContactSaga);
      yield takeLatest(fetchAuditLogByLease, fetchAuditLogByLeaseSaga);
      yield takeLatest(
        fetchAuditLogByAreaSearch,
        fetchAuditLogByAreaSearchSaga,
      );
    }),
  ]);
}
