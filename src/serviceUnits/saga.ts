import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { receiveServiceUnits, notFound } from "./actions";
import { fetchServiceUnits } from "./requests";
import { receiveError } from "@/api/actions";

function* fetchServiceUnitsSaga(): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchServiceUnits);

    switch (statusCode) {
      case 200:
        const data = bodyAsJson.results;
        yield put(receiveServiceUnits(data));
        break;

      default:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch service units with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/serviceUnits/FETCH_ALL', fetchServiceUnitsSaga);
  })]);
}