import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { receivePenaltyInterestByInvoice, penaltyInterestNotFoundByInvoice } from "./actions";
import { receiveError } from "@/api/actions";
import { fetchPenaltyInterestByInvoice } from "./requests";

function* fetchPenaltyInterestByInvoiceSaga({
  payload: invoiceId,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchPenaltyInterestByInvoice, invoiceId);

    switch (statusCode) {
      case 200:
        yield put(receivePenaltyInterestByInvoice({
          invoiceId: invoiceId,
          penaltyInterest: bodyAsJson
        }));
        break;

      default:
        yield put(penaltyInterestNotFoundByInvoice(invoiceId));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch penalty interest by lease with error "%s"', error);
    yield put(penaltyInterestNotFoundByInvoice(invoiceId));
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeEvery('mvj/penaltyInterest/FETCH_BY_INVOICE', fetchPenaltyInterestByInvoiceSaga);
  })]);
}