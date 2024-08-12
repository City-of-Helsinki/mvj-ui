import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { notFound, receiveLeaseTypes } from "./actions";
import { receiveError } from "@/api/actions";
import { fetchLeaseTypes } from "./requests";

function* fetchLeaseTypesSaga(): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchLeaseTypes);

    switch (statusCode) {
      case 200:
        const {
          results
        } = bodyAsJson;
        yield put(receiveLeaseTypes(results));
        break;

      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch lease types with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/leaseType/FETCH_ALL', fetchLeaseTypesSaga);
  })]);
}