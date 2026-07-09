import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import get from "lodash/get";
import callApi from "@/api/callApi";
import { receiveIntendedUse, intendedUseNotFound } from "@/intendedUse/actions";
import { receiveError } from "@/api/actions";
import { fetchIntendedUse } from "@/intendedUse/requests";

function* fetchIntendedUseSaga(): Generator<any, any, any> {
  try {
    let results = [];
    // Gets all IntendedUse's, even those that have is_active=false.
    let {
      response: { status: statusCode },
      bodyAsJson: body,
    } = yield call(fetchIntendedUse, { limit: 300 });
    results = get(body, "results", []);

    // Fetch all paginated pages
    while (statusCode === 200 && get(body, "next")) {
      const next = get(body, "next");
      const {
        response: { status },
        bodyAsJson,
      } = yield call(callApi, new Request(next));
      statusCode = status;
      body = bodyAsJson;
      results = [...results, ...get(body, "results", [])];
    }

    switch (statusCode) {
      case 200:
        yield put(receiveIntendedUse(results));
        break;

      default:
        yield put(intendedUseNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch intended use with error "%s"', error);
    yield put(intendedUseNotFound());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([
    fork(function* (): Generator<any, any, any> {
      yield takeLatest("mvj/intendedUse/FETCH_ALL", fetchIntendedUseSaga);
    }),
  ]);
}
