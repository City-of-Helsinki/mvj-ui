import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { push } from "react-router-redux";
import { SubmissionError } from "redux-form";
import {
  hideEditMode,
  attributesNotFound,
  notFound,
  receiveAttributes,
  receiveMethods,
  receiveRentBasisList,
  receiveSingleRentBasis,
} from "./actions";
import { receiveError } from "@/api/actions";
import { displayUIMessage } from "@/util/helpers";
import {
  createRentBasis,
  editRentBasis,
  fetchAttributes,
  fetchRentBasisList,
  fetchSingleRentBasis,
} from "./requests";
import { getRouteById, Routes } from "@/root/routes";

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchAttributes);
    const attributes = bodyAsJson.fields;
    const methods = bodyAsJson.methods;

    switch (statusCode) {
      case 200:
        yield put(receiveAttributes(attributes));
        yield put(receiveMethods(methods));
        break;

      default:
        yield put(attributesNotFound());
        break;
    }
  } catch (error) {
    console.error(
      'Failed to fetch rent basis attributes with error "%s"',
      error,
    );
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchRentBasisListSaga({
  payload: query,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchRentBasisList, query);

    switch (statusCode) {
      case 200:
        yield put(receiveRentBasisList(bodyAsJson));
        break;

      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch rent basis list with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchSingleRentBasisSaga({
  payload: id,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchSingleRentBasis, id);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleRentBasis(bodyAsJson));
        break;

      case 404:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({ ...bodyAsJson })));
        break;

      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch rent basis with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* createRentBasisSaga({
  payload: rentBasis,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(createRentBasis, rentBasis);

    switch (statusCode) {
      case 201:
        yield put(push(`${getRouteById(Routes.RENT_BASIS)}/${bodyAsJson.id}`));
        displayUIMessage({
          title: "",
          body: "Vuokrausperiaate luotu",
        });
        break;

      case 400:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({ ...bodyAsJson })));
        break;

      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to create rent basis with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* editRentBasisSaga({
  payload: rentBasis,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(editRentBasis, rentBasis);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleRentBasis(bodyAsJson));
        yield put(hideEditMode());
        displayUIMessage({
          title: "",
          body: "Vuokrausperiaate tallennettu",
        });
        break;

      case 400:
        yield put(notFound());
        yield put(
          receiveError(new SubmissionError({ ...bodyAsJson, _error: "Virhe" })),
        );
        break;

      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to edit rent basis with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([
    fork(function* (): Generator<any, any, any> {
      yield takeLatest("mvj/rentbasis/FETCH_ATTRIBUTES", fetchAttributesSaga);
      yield takeLatest("mvj/rentbasis/FETCH_ALL", fetchRentBasisListSaga);
      yield takeLatest("mvj/rentbasis/CREATE", createRentBasisSaga);
      yield takeLatest("mvj/rentbasis/EDIT", editRentBasisSaga);
      yield takeLatest("mvj/rentbasis/FETCH_SINGLE", fetchSingleRentBasisSaga);
    }),
  ]);
}
