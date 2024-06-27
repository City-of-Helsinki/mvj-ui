import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { SubmissionError } from "redux-form";
import { receiveError } from "/src/api/actions";
import { attributesNotFound, fetchUiDataList as fetchUiDataListAction, receiveAttributes, receiveMethods, receiveUiDataList, notFound } from "./actions";
import { displayUIMessage } from "/src/util/helpers";
import { createUiData, deleteUiData, editUiData, fetchAttributes, fetchUiDataList } from "./requests";

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
        const methods = bodyAsJson.methods;
        yield put(receiveAttributes(attributes));
        yield put(receiveMethods(methods));
        break;

      default:
        yield put(attributesNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch ui data attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchUiDataListSaga({
  payload: query,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchUiDataList, query);

    switch (statusCode) {
      case 200:
        yield put(receiveUiDataList(bodyAsJson.results));
        break;

      default:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch ui data list with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* createUiDataSaga({
  payload,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(createUiData, payload);

    switch (statusCode) {
      case 201:
        yield put(fetchUiDataListAction({
          limit: 10000
        }));
        displayUIMessage({
          title: '',
          body: 'Ohjeteksti tallennettu'
        });
        break;

      default:
        yield put(notFound());
        yield put(receiveError(new SubmissionError(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to create ui data with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* deleteUiDataSaga({
  payload: id,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(deleteUiData, id);

    switch (statusCode) {
      case 204:
        yield put(fetchUiDataListAction({
          limit: 10000
        }));
        displayUIMessage({
          title: '',
          body: 'Ohjeteksti poistettu'
        });
        break;

      default:
        yield put(notFound());
        yield put(receiveError(new SubmissionError(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to delete ui data with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* editUiDataSaga({
  payload,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(editUiData, payload);

    switch (statusCode) {
      case 200:
        yield put(fetchUiDataListAction({
          limit: 10000
        }));
        displayUIMessage({
          title: '',
          body: 'Ohjeteksti tallennettu'
        });
        break;

      default:
        yield put(notFound());
        yield put(receiveError(new SubmissionError(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to edit ui data with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/uiData/FETCH_ATTRIBUTES', fetchAttributesSaga);
    yield takeLatest('mvj/uiData/FETCH_ALL', fetchUiDataListSaga);
    yield takeLatest('mvj/uiData/CREATE', createUiDataSaga);
    yield takeLatest('mvj/uiData/DELETE', deleteUiDataSaga);
    yield takeLatest('mvj/uiData/EDIT', editUiDataSaga);
  })]);
}