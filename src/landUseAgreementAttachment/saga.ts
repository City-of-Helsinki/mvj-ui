import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { SubmissionError } from "redux-form";
import { attributesNotFound, receiveAttributes, receiveMethods } from "./actions";
import { fetchSingleLandUseContract } from "/src/landUseContract/actions";
import { receiveError } from "/src/api/actions";
import { displayUIMessage } from "/src/util/helpers";
import { fetchAttributes, createLandUseAgreementAttachment, deleteLandUseAgreementAttachment } from "./requests";

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
    console.error('Failed to fetch land use agreement attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* createLandUseAgreementAttachmentSaga({
  payload,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(createLandUseAgreementAttachment, payload);

    switch (statusCode) {
      case 201:
        yield put(fetchSingleLandUseContract(payload.id));
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

function* deleteLandUseAgreementAttachmentSaga({
  payload,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(deleteLandUseAgreementAttachment, payload.fileId);

    switch (statusCode) {
      case 204:
        yield put(fetchSingleLandUseContract(payload.id));
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
    yield takeLatest('mvj/landUseAgreementAttachment/FETCH_ATTRIBUTES', fetchAttributesSaga);
    yield takeLatest('mvj/landUseAgreementAttachment/CREATE', createLandUseAgreementAttachmentSaga);
    yield takeLatest('mvj/landUseAgreementAttachment/DELETE', deleteLandUseAgreementAttachmentSaga);
  })]);
}