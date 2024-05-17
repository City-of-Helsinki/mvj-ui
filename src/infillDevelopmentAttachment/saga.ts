import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { SubmissionError } from "redux-form";
import { attributesNotFound, receiveAttributes, receiveMethods } from "./actions";
import { fetchSingleInfillDevelopment } from "src/infillDevelopment/actions";
import { receiveError } from "src/api/actions";
import { displayUIMessage } from "src/util/helpers";
import { fetchAttributes, createInfillDevelopmentAttachment, deleteInfillDevelopmentAttachment } from "./requests";

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
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
    console.error('Failed to fetch infill development attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* createInfillDevelopmentAttachmentSaga({
  payload
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(createInfillDevelopmentAttachment, payload);

    switch (statusCode) {
      case 201:
        yield put(fetchSingleInfillDevelopment(payload.id));
        displayUIMessage({
          title: '',
          body: 'Tiedosto ladattu'
        });
        break;

      case 404:
        yield put(receiveError(new SubmissionError({ ...bodyAsJson
        })));
        break;
    }
  } catch (error) {
    console.error('Failed to create an attachment with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* deleteInfillDevelopmentAttachmentSaga({
  payload
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(deleteInfillDevelopmentAttachment, payload.fileId);

    switch (statusCode) {
      case 204:
        yield put(fetchSingleInfillDevelopment(payload.id));
        displayUIMessage({
          title: '',
          body: 'Tiedosto poistettu'
        });
        break;

      case 404:
        yield put(receiveError(new SubmissionError({ ...bodyAsJson
        })));
        break;
    }
  } catch (error) {
    console.error('Failed to delete an attachment with error "%s"', error);
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/infillDevelopmentAttachment/FETCH_ATTRIBUTES', fetchAttributesSaga);
    yield takeLatest('mvj/infillDevelopmentAttachment/CREATE', createInfillDevelopmentAttachmentSaga);
    yield takeLatest('mvj/infillDevelopmentAttachment/DELETE', deleteInfillDevelopmentAttachmentSaga);
  })]);
}