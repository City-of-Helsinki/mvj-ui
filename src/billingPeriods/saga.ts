import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { notFound, receiveBillingPeriodsByLease } from "./actions";
import { fetchBillingPeriods } from "./requests";
import { receiveError } from "../api/actions";

function* fetchBillingPeriodsSaga({
  payload,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchBillingPeriods, payload);

    switch (statusCode) {
      case 200:
        yield put(receiveBillingPeriodsByLease({
          leaseId: payload.leaseId,
          billingPeriods: bodyAsJson.billing_periods
        }));
        break;

      case 404:
        yield put(notFound());
        break;

      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch billing periods with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/billingperiods/FETCH_ALL', fetchBillingPeriodsSaga);
  })]);
}