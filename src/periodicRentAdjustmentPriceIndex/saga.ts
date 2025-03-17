import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { notFound, receivePeriodicRentAdjustmentPriceIndex } from "./actions";
import { fetchPeriodicRentAdjustmentPriceIndex } from "./requests";
import { receiveError } from "@/api/actions";
import { FETCH_ACTION_STRING } from "./constants";

function* fetchPeriodicRentAdjustmentPriceIndexSaga(): Generator<
  any,
  any,
  any
> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchPeriodicRentAdjustmentPriceIndex);

    switch (statusCode) {
      case 200:
        yield put(receivePeriodicRentAdjustmentPriceIndex(bodyAsJson));
        break;

      default:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error(
      'Failed to fetch fetch periodic rent adjustment price index with error "%s"',
      error,
    );
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([
    fork(function* (): Generator<any, any, any> {
      yield takeLatest(
        FETCH_ACTION_STRING,
        fetchPeriodicRentAdjustmentPriceIndexSaga,
      );
    }),
  ]);
}
