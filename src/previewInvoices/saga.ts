import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { notFound, receivePreviewInvoices } from "./actions";
import { receiveError } from "src/api/actions";
import { fetchPreviewInvoices } from "./requests";

function* fetchPreviewInvoicesSaga({
  payload
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchPreviewInvoices, payload);

    switch (statusCode) {
      case 200:
        yield put(receivePreviewInvoices(bodyAsJson));
        break;

      default:
        yield put(receiveError({ ...bodyAsJson
        }));
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch collection letters by lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/previewInvoices/FETCH_ALL', fetchPreviewInvoicesSaga);
  })]);
}