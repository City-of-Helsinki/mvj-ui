import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { notFound, receiveSapInvoices } from "./actions";
import { receiveError } from "src/api/actions";
import { fetchInvoices } from "src/invoices/requests";

function* fetchSapInvoicesSaga({
  payload: query,
  type: string
}): Generator<any, any, any> {
  try {
    let {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchInvoices, { ...query,
      going_to_sap: true
    });

    switch (statusCode) {
      case 200:
        yield put(receiveSapInvoices(bodyAsJson));
        break;

      default:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch sap invoices with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/sapInvoice/FETCH_ALL', fetchSapInvoicesSaga);
  })]);
}