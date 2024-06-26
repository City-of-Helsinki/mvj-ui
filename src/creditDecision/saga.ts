import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { receiveError } from "/src/api/actions";
import { creditDecisionNotFoundByBusinessId, creditDecisionNotFoundByContactId, creditDecisionNotFoundByNin, fetchHistoryByBusinessId, fetchHistoryByContactId, historyNotFoundByBusinessId, historyNotFoundByContactId, receiveCreditDecisionByBusinessId, receiveCreditDecisionByContactId, receiveCreditDecisionByNin, receiveHistoryByBusinessId, receiveHistoryByContactId } from "./actions";
import { fetchHistoryBusinessId, fetchHistoryContactId, fetchCreditDecisionContactId, fetchCreditDecisionBusinessId, fetchCreditDecisionNin } from "./requests";

function* fetchHistoryByBusinessIdSaga({
  payload: id,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchHistoryBusinessId, id);

    switch (statusCode) {
      case 200:
        yield put(receiveHistoryByBusinessId({
          [id.toString()]: bodyAsJson
        }));
        break;

      default:
        console.error('Failed to fetch history');
        yield put(historyNotFoundByBusinessId(id));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch history with error "%s"', error);
    yield put(historyNotFoundByBusinessId(id));
    yield put(receiveError(error));
  }
}

function* fetchHistoryByContactIdSaga({
  payload: id,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchHistoryContactId, id);

    switch (statusCode) {
      case 200:
        yield put(receiveHistoryByContactId({
          [id.toString()]: bodyAsJson
        }));
        break;

      default:
        console.error('Failed to fetch history');
        yield put(historyNotFoundByContactId(id));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch history with error "%s"', error);
    yield put(historyNotFoundByContactId(id));
    yield put(receiveError(error));
  }
}

function* fetchCreditDecisionByBusinessIdSaga({
  payload: id,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchCreditDecisionBusinessId, id);

    switch (statusCode) {
      case 200:
        const result = bodyAsJson[0];
        yield put(receiveCreditDecisionByBusinessId({
          [id.toString()]: result
        }));
        yield put(fetchHistoryByBusinessId(id));
        break;

      case 400:
        // Cannot find business id or identity number
        const error = bodyAsJson;
        console.error('Failed to fetch with error "%s"', error.message);
        yield put(creditDecisionNotFoundByBusinessId(id));
        yield put(receiveError(error));

      default:
        console.error('Failed to fetch credit decision');
        yield put(creditDecisionNotFoundByBusinessId(id));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch with error "%s"', error);
    yield put(creditDecisionNotFoundByBusinessId(id));
    yield put(receiveError(error));
  }
}

function* fetchCreditDecisionByContactIdSaga({
  payload: id,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchCreditDecisionContactId, id);

    switch (statusCode) {
      case 200:
        const result = bodyAsJson[0];
        yield put(receiveCreditDecisionByContactId({
          [id.toString()]: result
        }));
        yield put(fetchHistoryByContactId(id));
        break;

      case 400:
        // Cannot find business id or identity number
        const error = bodyAsJson;
        console.error('Failed to fetch with error "%s"', error.message);
        yield put(creditDecisionNotFoundByContactId(id));
        yield put(receiveError(error));

      default:
        console.error('Failed to fetch');
        yield put(creditDecisionNotFoundByContactId(id));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch with error "%s"', error);
    yield put(creditDecisionNotFoundByContactId(id));
    yield put(receiveError(error));
  }
}

function* fetchCreditDecisionByNinSaga({
  payload: id,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchCreditDecisionNin, id);

    switch (statusCode) {
      case 200:
        const result = bodyAsJson[0];
        yield put(receiveCreditDecisionByNin({
          [id.toString()]: result
        }));
        break;

      case 400:
        // Cannot find business id or identity number
        const error = bodyAsJson;
        console.error('Failed to fetch with error "%s"', error.message);
        yield put(creditDecisionNotFoundByNin(id));
        yield put(receiveError(error));

      default:
        console.error('Failed to fetch');
        yield put(creditDecisionNotFoundByNin(id));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch with error "%s"', error);
    yield put(creditDecisionNotFoundByNin(id));
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/creditDecision/FETCH_HISTORY_BY_BUSINESS_ID', fetchHistoryByBusinessIdSaga);
    yield takeLatest('mvj/creditDecision/FETCH_HISTORY_BY_CONTACT_ID', fetchHistoryByContactIdSaga);
    yield takeLatest('mvj/creditDecision/FETCH_CREDIT_DECISION_BY_BUSINESS_ID', fetchCreditDecisionByBusinessIdSaga);
    yield takeLatest('mvj/creditDecision/FETCH_CREDIT_DECISION_BY_CONTACT_ID', fetchCreditDecisionByContactIdSaga);
    yield takeLatest('mvj/creditDecision/FETCH_CREDIT_DECISION_BY_NIN', fetchCreditDecisionByNinSaga);
  })]);
}