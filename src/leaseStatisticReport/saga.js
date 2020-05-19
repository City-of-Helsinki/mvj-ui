// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';
import {SubmissionError} from 'redux-form';

import {
  receiveAttributes,
  attributesNotFound,
  receiveLeaseInvoicingConfirmationReportAttributes,
  leaseInvoicingConfirmationReportAttributesNotFound,
  receiveLeaseInvoicingConfrimationReports,
  notFoundLeaseInvoicingConfrimationReports,
  receiveReports,
  reportsNotFound,
  receiveReportData,
  reportDataNotFound,
  mailSent,
  noMailSent,
  receiveOptions,
  optionsNotFound,
} from './actions';
import {fetchAttributes, fetchLeaseInvoicingConfirmationReportAttributes, fetchLeaseInvoicingConfrimationReports, fetchReports, fetchReportData, sendReportToMail, fetchOptions} from './requests';
import {receiveError} from '../api/actions';
import {displayUIMessage} from '$util/helpers';

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

function* fetchReportsSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchReports);

    switch (statusCode) {
      case 200:
        yield put(receiveReports(bodyAsJson));
        break;
      default:
        yield put(reportsNotFound());
        break;
    } 
  } catch (error) {
    console.error('Failed to fetch reports with error "%s"', error);
    yield put(reportsNotFound());
    yield put(receiveError(error));
  }
}

function* fetchReportDataSaga({payload}): Generator<any, any, any> {

  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchReportData, payload);

    switch (statusCode) {
      case 200:
        yield put(receiveReportData(bodyAsJson));
        break;
      case 400:
        yield put(reportDataNotFound());
        yield put(receiveReportData([]));
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
      default:
        yield put(reportDataNotFound());
        break;
    } 
  } catch (error) {
    console.error('Failed to fetch report data with error "%s"', error);
    yield put(reportDataNotFound());
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

function* sendReportToMailSaga({payload: query}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(sendReportToMail, query);

    switch (statusCode) {
      case 200:
        displayUIMessage({title: '', body: bodyAsJson.message});
        yield put(mailSent());
        break;
      case 400:
        yield put(receiveError(new SubmissionError({_error: 'Server error 400', ...bodyAsJson})));
        yield put(noMailSent());
        break;
      case 404:
      case 500:
        yield put(receiveError(new SubmissionError({_error: 'Server error 500', ...bodyAsJson})));
        yield put(noMailSent());
        break;
    }
  } catch (error) {
    console.error('Failed to send report to mail, error "%s"', error);
    yield put(noMailSent());
    yield put(receiveError(error));
  }
}

function* fetchOptionsSaga({payload}): Generator<any, any, any> {
  // TODO ALSO WRITE SPEC
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchOptions, payload);

    switch (statusCode) {
      case 200:
        yield put(receiveOptions(bodyAsJson));
        break;
      default:
        yield put(optionsNotFound());
        break;
    } 
  } catch (error) {
    console.error('Failed to fetch options with error "%s"', error);
    yield put(optionsNotFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/leaseStatisticReport/FETCH_REPORTS', fetchReportsSaga);
      yield takeLatest('mvj/leaseStatisticReport/FETCH_REPORT_DATA', fetchReportDataSaga);
      yield takeLatest('mvj/leaseStatisticReport/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/leaseStatisticReport/FETCH_LEASE_INVOICING_CONFIRMATION_REPORT_ATTRIBUTES', fetchLeaseInvoicingConfirmationReportAttributesSaga);
      yield takeLatest('mvj/leaseStatisticReport/FETCH_LEASE_INVOICING_CONFIRMATION_REPORTS', fetchLeaseInvoicingConfrimationReportsSaga);
      yield takeLatest('mvj/leaseStatisticReport/SEND_REPORT_TO_MAIL', sendReportToMailSaga);
      yield takeLatest('mvj/leaseStatisticReport/FETCH_OPTIONS', fetchOptionsSaga);
    }),
  ]);
}
