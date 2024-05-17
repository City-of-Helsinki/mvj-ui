import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import get from "lodash/get";
import { receiveUsers, notFound } from "./actions";
import { fetchUsers } from "./requests";
import { receiveError } from "../api/actions";

function* fetchUsersSaga({
  payload: search,
  type: string
}): Generator<any, any, any> {
  try {
    let results = [];
    let {
      response: {
        status: statusCode
      },
      bodyAsJson: body
    } = yield call(fetchUsers, search);
    results = get(body, 'results', []);

    while (statusCode === 200 && get(body, 'next')) {
      const next = get(body, 'next');
      const {
        response: {
          status
        },
        bodyAsJson
      } = yield call(fetchUsers, `?${next.split('?').pop()}`);
      statusCode = status;
      body = bodyAsJson;
      results = [...results, ...get(body, 'results', [])];
    }

    switch (statusCode) {
      case 200:
        yield put(receiveUsers(results));
        break;

      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch users with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest("mvj/users/FETCH_ALL", fetchUsersSaga);
  })]);
}