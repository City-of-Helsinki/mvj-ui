import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { notFound, receiveIsSaveClicked, receiveRentForPeriodByLease } from "./actions";
import { fetchRentForPeriod } from "./requests";
import { receiveError } from "@/api/actions";

function* fetchRentForPeriodSaga({
  payload,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchRentForPeriod, payload);

    switch (statusCode) {
      case 200:
        yield put(receiveRentForPeriodByLease({
          leaseId: payload.leaseId,
          rent: { ...bodyAsJson,
            id: payload.id,
            allowDelete: payload.allowDelete,
            rentCalculatorType: payload.rentCalculatorType
          }
        }));
        yield put(receiveIsSaveClicked(false));
        break;

      case 404:
        yield put(notFound());
        break;

      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch rent for period with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/rentforperiod/FETCH_ALL', fetchRentForPeriodSaga);
  })]);
}