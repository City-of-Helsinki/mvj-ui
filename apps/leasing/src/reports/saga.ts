import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { SubmissionError } from "redux-form";
import {
  receiveAttributes,
  attributesNotFound,
  receiveReports,
  reportsNotFound,
  receiveReportData,
  reportDataNotFound,
  mailSent,
  noMailSent,
  receiveOptions,
  optionsNotFound,
} from "./actions";
import {
  fetchAttributes,
  fetchReports,
  fetchReportData,
  sendReportToMail,
  fetchOptions,
} from "./requests";
import { receiveError } from "@/api/actions";
import { displayUIMessage } from "@/util/helpers";

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchAttributes);

    switch (statusCode) {
      case 200: {
        const attributes = bodyAsJson.fields;
        yield put(receiveAttributes(attributes));
        break;
      }

      default:
        yield put(attributesNotFound());
        break;
    }
  } catch (error) {
    console.error(
      'Failed to fetch lease report attributes with error "%s"',
      error,
    );
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchReportsSaga(): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchReports);

    switch (statusCode) {
      case 200:
        yield put(receiveReports(bodyAsJson));
        break;

      case 403:
        yield put(
          receiveError(
            new SubmissionError({
              _error: "Server error 403",
              ...bodyAsJson,
            }),
          ),
        );
        yield put(reportsNotFound());
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

function* fetchReportDataSaga({
  payload,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchReportData, payload);

    switch (statusCode) {
      case 200:
        yield put(receiveReportData(bodyAsJson));
        break;

      case 400:
        yield put(reportDataNotFound());
        yield put(receiveReportData([]));
        yield put(receiveError(new SubmissionError({ ...bodyAsJson })));
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

function* sendReportToMailSaga({
  payload: query,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(sendReportToMail, query);

    switch (statusCode) {
      case 200:
        displayUIMessage({
          title: "",
          body: bodyAsJson.message,
        });
        yield put(mailSent());
        break;

      case 400:
        yield put(
          receiveError(
            new SubmissionError({
              _error: "Server error 400",
              ...bodyAsJson,
            }),
          ),
        );
        yield put(noMailSent());
        break;

      case 403:
        yield put(
          receiveError(
            new SubmissionError({
              _error: "Server error 403",
              ...bodyAsJson,
            }),
          ),
        );
        yield put(noMailSent());
        break;

      case 404:
      case 500:
        yield put(
          receiveError(
            new SubmissionError({
              _error: "Server error 500",
              ...bodyAsJson,
            }),
          ),
        );
        yield put(noMailSent());
        break;
    }
  } catch (error) {
    console.error('Failed to send report to mail, error "%s"', error);
    yield put(noMailSent());
    yield put(receiveError(error));
  }
}

function* fetchOptionsSaga({ payload, type: any }): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchOptions, payload);

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

export default function* (): Generator<any, any, any> {
  yield all([
    fork(function* (): Generator<any, any, any> {
      yield takeLatest("mvj/reports/FETCH_REPORTS", fetchReportsSaga);
      yield takeLatest("mvj/reports/FETCH_REPORT_DATA", fetchReportDataSaga);
      yield takeLatest("mvj/reports/FETCH_ATTRIBUTES", fetchAttributesSaga);
      yield takeLatest("mvj/reports/SEND_REPORT_TO_MAIL", sendReportToMailSaga);
      yield takeLatest("mvj/reports/FETCH_OPTIONS", fetchOptionsSaga);
    }),
  ]);
}
