import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { notFound, receiveVats } from "./actions";
import { fetchVats } from "./requests";
import { receiveError } from "/src/api/actions";

function* fetchVatsSaga(): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchVats);

    switch (statusCode) {
      case 200:
        yield put(receiveVats(bodyAsJson.results));
        break;

      default:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch vats with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/vat/FETCH_ALL', fetchVatsSaga);
  })]);
}