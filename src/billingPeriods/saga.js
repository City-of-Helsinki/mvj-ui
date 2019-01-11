// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';

import {
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  notFound,
  receiveBillingPeriodsByLease,
} from './actions';
import {
  fetchAttributes,
  fetchBillingPeriods,
} from './requests';
import {receiveError} from '../api/actions';

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttributes);

    switch (statusCode) {
      case 200:
        const attributes = bodyAsJson.fields;
        const methods = bodyAsJson.methods;

        yield put(receiveAttributes(attributes));
        yield put(receiveMethods(methods));
        break;
      default:
        yield put(attributesNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch billing period attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchBillingPeriodsSaga({payload}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchBillingPeriods, payload);

    switch (statusCode) {
      case 200:
        yield put(receiveBillingPeriodsByLease({leaseId: payload.leaseId, billingPeriods: bodyAsJson.billing_periods}));
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

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/billingperiods/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/billingperiods/FETCH_ALL', fetchBillingPeriodsSaga);
    }),
  ]);
}
