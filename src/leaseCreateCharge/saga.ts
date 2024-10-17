import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { receiveAttributes, attributesNotFound, receiveReceivableTypes, receivableTypesNotFound } from "./actions";
import { receiveError } from "@/api/actions";
import { fetchAttributes, fetchReceivableTypes } from "./requests";

const SAFETY_CAP_FOR_WHILE_LOOP_ITERATIONS = 20;

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
  let nextUrl = ''
  let iterationCounter = 0;
  const allReceivableTypes = []
  try {
    while (nextUrl !== null && iterationCounter < SAFETY_CAP_FOR_WHILE_LOOP_ITERATIONS) {
      const {
        response: {
          status: statusCode
        },
        bodyAsJson
      } = yield call(fetchReceivableTypes, nextUrl);

      switch (statusCode) {
        case 200:
          allReceivableTypes.push(...bodyAsJson.results);
          nextUrl = bodyAsJson.next || null;
          break;

        default:
          yield put(receivableTypesNotFound());
          nextUrl = null;
          break;
      }
      iterationCounter++;
    }
    yield put(receiveReceivableTypes(allReceivableTypes));
  } catch (error) {
    console.error('Failed to fetch receivable types with error "%s"', error);
    yield put(receivableTypesNotFound());
    yield put(receiveError(error));
    nextUrl = null;
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/leaseCreateCharge/FETCH_ATTRIBUTES', fetchAttributesSaga);
    yield takeLatest('mvj/leaseCreateCharge/FETCH_RECEIVABLE_TYPES', fetchReceivableTypesSaga);
  })]);
}