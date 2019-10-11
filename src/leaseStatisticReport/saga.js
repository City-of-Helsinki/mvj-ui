// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';

import {
  receiveAttributes,
  attributesNotFound,
  receiveLeaseInvoicingConfirmationReportAttributes,
  leaseInvoicingConfirmationReportAttributesNotFound,
  receiveLeaseInvoicingConfrimationReports,
  notFoundLeaseInvoicingConfrimationReports,
} from './actions';
import {fetchAttributes, fetchLeaseInvoicingConfirmationReportAttributes, fetchLeaseInvoicingConfrimationReports} from './requests';
import {receiveError} from '../api/actions';

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttributes);

    switch (statusCode) {
      case 200:
        const attributes = bodyAsJson.fields;

        yield put(receiveAttributes(attributes));
        break;
      default:
        yield put(attributesNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch lease statistic report attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchLeaseInvoicingConfirmationReportAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchLeaseInvoicingConfirmationReportAttributes);

    switch (statusCode) {
      case 200:
        const attributes = bodyAsJson.fields;

        yield put(receiveLeaseInvoicingConfirmationReportAttributes(attributes));
        break;
      default:
        yield put(leaseInvoicingConfirmationReportAttributesNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch lease statistic report attributes with error "%s"', error);
    yield put(leaseInvoicingConfirmationReportAttributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchLeaseInvoicingConfrimationReportsSaga({payload: query}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchLeaseInvoicingConfrimationReports, query);

    switch (statusCode) {
      case 200:
        yield put(receiveLeaseInvoicingConfrimationReports(bodyAsJson));
        break;
      case 404:
      case 500:
        yield put(notFoundLeaseInvoicingConfrimationReports());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch scheduled jobs with error "%s"', error);
    yield put(notFoundLeaseInvoicingConfrimationReports());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/leaseStatisticReport/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/leaseStatisticReport/FETCH_LEASE_INVOICING_CONFIRMATION_REPORT_ATTRIBUTES', fetchLeaseInvoicingConfirmationReportAttributesSaga);
      yield takeLatest('mvj/leaseStatisticReport/FETCH_LEASE_INVOICING_CONFIRMATION_REPORTS', fetchLeaseInvoicingConfrimationReportsSaga);
    }),
  ]);
}
