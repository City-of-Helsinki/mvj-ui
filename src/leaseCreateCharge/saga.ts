import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { receiveAttributes, attributesNotFound, receiveReceivableTypes, receivableTypesNotFound } from "./actions";
import { receiveError } from "/src/api/actions";
import { fetchAttributes, fetchReceivableTypes } from "./requests";

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchAttributes);

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
    console.error('Failed to fetch lease create charge attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchReceivableTypesSaga(): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchReceivableTypes);

    switch (statusCode) {
      case 200:
        const receivableTypes = bodyAsJson.results;
        yield put(receiveReceivableTypes(receivableTypes));
        break;

      default:
        yield put(receivableTypesNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch receivable types with error "%s"', error);
    yield put(receivableTypesNotFound());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/leaseCreateCharge/FETCH_ATTRIBUTES', fetchAttributesSaga);
    yield takeLatest('mvj/leaseCreateCharge/FETCH_RECEIVABLE_TYPES', fetchReceivableTypesSaga);
  })]);
}