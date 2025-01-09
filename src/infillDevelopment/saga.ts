import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { push } from "react-router-redux";
import { SubmissionError } from "redux-form";
import {
  fetchSingleInfillDevelopment as fetchSingleInfillDevelopmentAction,
  hideEditMode,
  attributesNotFound,
  notFound,
  receiveIsSaveClicked,
  receiveAttributes,
  receiveMethods,
  receiveInfillDevelopments,
  receiveSingleInfillDevelopment,
} from "./actions";
import { receiveError } from "@/api/actions";
import { displayUIMessage } from "@/util/helpers";
import {
  createInfillDevelopment,
  editInfillDevelopment,
  fetchAttributes,
  fetchInfillDevelopments,
  fetchSingleInfillDevelopment,
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
      'Failed to fetch infill development attributes with error "%s"',
      error,
    );
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchInfillDevelopmentsSaga({
  payload: query,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchInfillDevelopments, query);

    switch (statusCode) {
      case 200:
        yield put(receiveInfillDevelopments(bodyAsJson));
        break;

      case 401:
      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error(
      'Failed to fetch infill development compensations with error "%s"',
      error,
    );
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchSingleInfillDevelopmentSaga({
  payload: id,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchSingleInfillDevelopment, id);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleInfillDevelopment(bodyAsJson));
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
    console.error(
      'Failed to fetch single infill development compensation with error "%s"',
      error,
    );
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* createInfillDevelopmentSaga({
  payload: infillDevelopment,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(createInfillDevelopment, infillDevelopment);

    switch (statusCode) {
      case 201:
        yield put(
          push(`${getRouteById(Routes.INFILL_DEVELOPMENTS)}/${bodyAsJson.id}`),
        );
        displayUIMessage({
          title: "",
          body: "Täydennysrakentamiskorvaus luotu",
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
    console.error(
      'Failed to create infill development compensation with error "%s"',
      error,
    );
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* editInfillDevelopmentSaga({
  payload: infillDevelopment,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(editInfillDevelopment, infillDevelopment);

    switch (statusCode) {
      case 200:
        yield put(fetchSingleInfillDevelopmentAction(infillDevelopment.id));
        yield put(receiveIsSaveClicked(false));
        yield put(hideEditMode());
        displayUIMessage({
          title: "",
          body: "Täydennysrakentamiskorvaus tallennettu",
        });
        break;

      case 400:
        yield put(notFound());
        yield put(
          receiveError(
            new SubmissionError({
              _error: "Server error 400",
              ...bodyAsJson,
            }),
          ),
        );
        break;

      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error(
      'Failed to edit infill development compensation with error "%s"',
      error,
    );
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([
    fork(function* (): Generator<any, any, any> {
      yield takeLatest(
        "mvj/infillDevelopment/FETCH_ATTRIBUTES",
        fetchAttributesSaga,
      );
      yield takeLatest(
        "mvj/infillDevelopment/FETCH_ALL",
        fetchInfillDevelopmentsSaga,
      );
      yield takeLatest(
        "mvj/infillDevelopment/FETCH_SINGLE",
        fetchSingleInfillDevelopmentSaga,
      );
      yield takeLatest(
        "mvj/infillDevelopment/CREATE",
        createInfillDevelopmentSaga,
      );
      yield takeLatest("mvj/infillDevelopment/EDIT", editInfillDevelopmentSaga);
    }),
  ]);
}
