import { all, call, fork, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { getFormValues, initialize } from "redux-form";
import { applicantInfoCheckAttributesNotFound, applicationRelatedAttachmentsNotFound, attachmentAttributesNotFound, attributesNotFound, fetchApplicationRelatedAttachments, fetchPendingUploads, formAttributesNotFound, pendingUploadsNotFound, receiveApplicantInfoCheckAttributes, receiveApplicationRelatedAttachments, receiveAttachmentAttributes, receiveAttachmentMethods, receiveAttributes, receiveFileOperationFinished, receiveFormAttributes, receiveMethods, receivePendingUploads } from "application/actions";
import { receiveError } from "api/actions";
import { deleteUploadRequest, fetchApplicantInfoCheckAttributesRequest, fetchAttachmentAttributesRequest, fetchAttributesRequest, fetchFormAttributesRequest, fetchPendingUploadsRequest, fetchSingleApplicationAttachments, uploadFileRequest } from "application/requests";
import { getApplicantInfoCheckFormName } from "application/helpers";
import { getContentUser } from "users/helpers";
import { displayUIMessage } from "util/helpers";
import type { DeleteUploadAction, ReceiveUpdatedTargetInfoCheckItemAction, UploadFileAction } from "application/types";

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchAttributesRequest);

    switch (statusCode) {
      case 200:
        const attributes = { ...bodyAsJson.fields
        };
        const methods = bodyAsJson.methods;
        yield put(receiveAttributes(attributes));
        yield put(receiveMethods(methods));
        break;

      default:
        yield put(attributesNotFound());
    }
  } catch (error) {
    console.error('Failed to fetch attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchApplicantInfoCheckAttributesSaga(): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchApplicantInfoCheckAttributesRequest);

    switch (statusCode) {
      case 200:
        const attributes = { ...bodyAsJson.fields
        };
        yield put(receiveApplicantInfoCheckAttributes(attributes));
        break;

      default:
        yield put(applicantInfoCheckAttributesNotFound());
    }
  } catch (error) {
    console.error('Failed to fetch info check attributes with error "%s"', error);
    yield put(applicantInfoCheckAttributesNotFound());
    yield put(receiveError(error));
  }
}

function* receiveUpdatedApplicantInfoCheckItemSaga({
  payload,
  type
}: ReceiveUpdatedTargetInfoCheckItemAction): Generator<any, any, any> {
  const formName = getApplicantInfoCheckFormName(payload.id);
  const oldValues = yield select(getFormValues(formName));
  yield put(initialize(formName, { ...oldValues,
    data: { ...payload.data,
      preparer: getContentUser(payload.data.preparer)
    }
  }));
}

function* fetchFormAttributesSaga({
  payload: id,
  type
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchFormAttributesRequest, id);

    switch (statusCode) {
      case 200:
        const attributes = bodyAsJson.fields;
        yield put(receiveFormAttributes(attributes));
        break;

      default:
        yield put(formAttributesNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch form attributes with error "%s"', error);
    yield put(formAttributesNotFound());
    yield put(receiveError(error));
  }
}

export function* fetchAttachmentAttributesSaga(): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchAttachmentAttributesRequest);

    switch (statusCode) {
      case 200:
        const attributes = { ...bodyAsJson.fields
        };
        const methods = bodyAsJson.methods;
        yield put(receiveAttachmentAttributes(attributes));
        yield put(receiveAttachmentMethods(methods));
        break;

      default:
        yield put(attachmentAttributesNotFound());
    }
  } catch (error) {
    console.error('Failed to fetch attachment attributes with error "%s"', error);
    yield put(attachmentAttributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchApplicationRelatedAttachmentsSaga({
  payload: id,
  type
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchSingleApplicationAttachments, id);

    switch (statusCode) {
      case 200:
        yield put(receiveApplicationRelatedAttachments(bodyAsJson));
        break;

      default:
        yield put(applicationRelatedAttachmentsNotFound());
        displayUIMessage({
          title: '',
          body: 'Hakemuksen liitteitä ei löytynyt!'
        }, {
          type: 'error'
        });
    }
  } catch (e) {
    yield put(applicationRelatedAttachmentsNotFound());
    displayUIMessage({
      title: '',
      body: 'Hakemuksen liitteitä ei löytynyt!'
    }, {
      type: 'error'
    });
  }
}

function* deleteUploadSaga({
  payload,
  type
}: DeleteUploadAction): Generator<any, any, any> {
  try {
    yield call(deleteUploadRequest, payload.id);
    yield put(receiveFileOperationFinished());

    if (payload.answer) {
      yield put(fetchApplicationRelatedAttachments(payload.answer));
    } else {
      yield put(fetchPendingUploads());
    }
  } catch (e) {
    console.error(e);
    yield put(pendingUploadsNotFound());
    throw e;
  }
}

function* uploadFileSaga({
  payload,
  type
}: UploadFileAction): Generator<any, any, any> {
  try {
    const {
      path,
      callback,
      fileData
    } = payload;
    const result = yield call(uploadFileRequest, fileData);
    yield put(receiveFileOperationFinished());

    if (fileData.answer) {
      yield put(fetchApplicationRelatedAttachments(fileData.answer));
    } else {
      yield put(fetchPendingUploads());
    }

    if (callback) {
      callback(path, result.bodyAsJson);
    }
  } catch (e) {
    console.log(e);
    yield put(pendingUploadsNotFound());
    throw e;
  }
}

function* fetchPendingUploadsSaga(): Generator<any, any, any> {
  try {
    const {
      response,
      bodyAsJson
    } = yield call(fetchPendingUploadsRequest);

    switch (response.status) {
      case 200:
        yield put(receivePendingUploads(bodyAsJson.results));
        break;

      default:
        yield put(pendingUploadsNotFound());
        break;
    }
  } catch (e) {
    console.error(e);
    yield put(pendingUploadsNotFound());
    throw e;
  }
}

function* receiveUpdatedTargetInfoCheckItemSaga({
  payload,
  type
}: ReceiveUpdatedTargetInfoCheckItemAction): Generator<any, any, any> {
  yield put(initialize(payload.targetForm, payload.data));
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/application/FETCH_ATTRIBUTES', fetchAttributesSaga);
    yield takeLatest('mvj/application/FETCH_APPLICANT_INFO_CHECK_ATTRIBUTES', fetchApplicantInfoCheckAttributesSaga);
    yield takeEvery('mvj/application/RECEIVE_UPDATED_APPLICANT_INFO_CHECK_ITEM', receiveUpdatedApplicantInfoCheckItemSaga);
    yield takeLatest('mvj/application/FETCH_FORM_ATTRIBUTES', fetchFormAttributesSaga);
    yield takeLatest('mvj/application/FETCH_ATTACHMENT_ATTRIBUTES', fetchAttachmentAttributesSaga);
    yield takeLatest('mvj/application/FETCH_ATTACHMENTS', fetchApplicationRelatedAttachmentsSaga);
    yield takeEvery('mvj/application/UPLOAD_FILE', uploadFileSaga);
    yield takeEvery('mvj/application/DELETE_UPLOAD', deleteUploadSaga);
    yield takeLatest('mvj/application/FETCH_PENDING_UPLOADS', fetchPendingUploadsSaga);
    yield takeEvery('mvj/application/RECEIVE_UPDATED_TARGET_INFO_CHECK_ITEM', receiveUpdatedTargetInfoCheckItemSaga);
  })]);
}