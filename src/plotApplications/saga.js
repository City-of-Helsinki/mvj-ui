// @flow

import {all, fork, put, takeLatest, takeEvery, call, select} from 'redux-saga/effects';
import {SubmissionError} from 'redux-form';
import {push} from 'react-router-redux';

import {displayUIMessage} from '$src/util/helpers';
import {
  receivePlotApplicationsList,
  receiveMethods,
  receiveAttributes,
  receiveSinglePlotApplication,
  hideEditMode,
  notFoundByBBox,
  receivePlotApplicationsByBBox,
  attributesNotFound,
  applicationsNotFound,
  plotSearchSubtypesNotFound,
  receivePlotSearchSubtypes,
  fetchApplicationRelatedForm,
  receiveApplicationRelatedForm,
  applicationRelatedFormNotFound,
  applicationRelatedAttachmentsNotFound,
  fetchApplicationRelatedAttachments,
  receiveApplicationRelatedAttachments,
  receivePlotApplicationSaved,
  receivePlotApplicationSaveFailed,
  fetchSinglePlotApplication,
  receiveFileOperationFinished,
  fetchPendingUploads,
  pendingUploadsNotFound,
  receivePendingUploads,
  receiveAttachmentAttributes,
  receiveAttachmentMethods,
  attachmentAttributesNotFound,
  fetchApplicationRelatedPlotSearch,
  receiveApplicationRelatedPlotSearch,
  applicationRelatedPlotSearchNotFound,
  fetchApplicantInfoCheckAttributes,
  receiveApplicantInfoCheckAttributes,
  applicantInfoCheckAttributesNotFound,
  receiveUpdatedApplicantInfoCheckItem,
  applicantInfoCheckUpdateFailed,
  receiveUpdatedTargetInfoCheckItem,
  targetInfoCheckUpdateFailed,
  targetInfoCheckMeetingMemoUploadFailed,
  receiveTargetInfoCheckMeetingMemoUploaded,
} from '$src/plotApplications/actions';
import {receiveError} from '$src/api/actions';

import {
  fetchPlotApplications,
  fetchSinglePlotApplication as fetchSinglePlotApplicationRequest,
  fetchAttributes,
  fetchPlotSearchSubtypesRequest,
  fetchSinglePlotApplicationAttachments,
  createPlotApplicationRequest,
  editPlotApplicationRequest,
  uploadFileRequest,
  deleteUploadRequest,
  fetchPendingUploadsRequest,
  fetchAttachmentAttributesRequest,
  fetchApplicantInfoCheckAttributesRequest,
  editApplicantInfoCheckItemRequest,
  editTargetInfoCheckItemRequest,
  createMeetingMemoRequest,
  deleteMeetingMemoRequest,
} from '$src/plotApplications/requests';
import {
  fetchFormRequest,
  fetchSinglePlotSearch,
} from '$src/plotSearch/requests';
import {
  fetchFormAttributes,
} from '$src/plotSearch/actions';
import {getRouteById, Routes} from '$src/root/routes';
import type {
  DeleteTargetInfoCheckMeetingMemoAction,
  DeleteUploadAction,
  PlotApplication,
  UploadFileAction,
  UploadTargetInfoCheckMeetingMemoAction,
} from '$src/plotApplications/types';
import {getCurrentPlotApplication} from '$src/plotApplications/selectors';

function* fetchPlotApplicationsSaga({payload: query}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchPlotApplications, query);
    switch (statusCode) {
      case 200:
        yield put(receivePlotApplicationsList(bodyAsJson));
        break;
      default:
        yield put(applicationsNotFound());
    }

  } catch (e) {
    console.error(e);
    yield put(applicationsNotFound());
  }
}

function* fetchPlotApplicationsByBBoxSaga({payload: query}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchPlotApplications, query);

    switch (statusCode) {
      case 200:
        yield put(receivePlotApplicationsByBBox(bodyAsJson));
        break;
      case 404:
      case 500:
        yield put(notFoundByBBox());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch applications with error "%s"', error);
    yield put(notFoundByBBox());
    yield put(receiveError(error));
  }
}

function* fetchSinglePlotApplicationSaga({payload: id}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSinglePlotApplicationRequest, id);
    switch (statusCode) {
      case 200:
        yield put(receiveSinglePlotApplication(bodyAsJson));
        yield put(fetchApplicationRelatedForm(bodyAsJson.form));
        yield put(fetchApplicationRelatedAttachments(id));
        yield put(fetchFormAttributes(bodyAsJson.form));
        yield put(fetchApplicantInfoCheckAttributes());
        break;
    }
  } catch (e) {
    console.error(e);
  }
}

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttributes);

    switch(statusCode) {
      case 200:
        const attributes = {
          ...bodyAsJson.fields,
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

function* createPlotApplicationSaga({payload: plotApplication}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(createPlotApplicationRequest, plotApplication);

    switch (statusCode) {
      case 200:
      case 201:
        yield put(receivePlotApplicationSaved(bodyAsJson.id));
        yield put(push(`${getRouteById(Routes.PLOT_APPLICATIONS)}/${bodyAsJson.id}`));
        yield put(fetchSinglePlotApplication(bodyAsJson.id));
        yield put(hideEditMode());
        displayUIMessage({title: '', body: 'Hakemus luotu'});
        break;
      default:
        yield put(receivePlotApplicationSaveFailed());
        displayUIMessage({title: '', body: 'Hakemuksen tallennus epäonnistui'}, {type: 'error'});
    }
  } catch(e) {
    yield put(receivePlotApplicationSaveFailed());
    console.log(e);
    displayUIMessage({title: '', body: 'Hakemuksen tallennus epäonnistui'}, {type: 'error'});
  }
}

function* editPlotApplicationSaga({payload: plotApplication}): Generator<any, any, any> {
  const handleFail = function*() {
    yield put(receivePlotApplicationSaveFailed());
    displayUIMessage({title: '', body: 'Hakemuksen tallennus epäonnistui'}, {type: 'error'});
  };

  try {
    const currentPlotApplication: ?PlotApplication = yield select(getCurrentPlotApplication);
    if (!currentPlotApplication) {
      yield handleFail();
      return;
    }

    const {response: {status: statusCode}, bodyAsJson} = yield call(editPlotApplicationRequest, currentPlotApplication?.id, plotApplication);

    switch (statusCode) {
      case 200:
      case 201:
        yield put(receivePlotApplicationSaved(bodyAsJson.id));
        yield put(receiveSinglePlotApplication(bodyAsJson));
        yield put(fetchApplicationRelatedAttachments(bodyAsJson.id));
        yield put(hideEditMode());
        displayUIMessage({title: '', body: 'Hakemus tallennettu'});
        break;
      default:
        yield handleFail();
    }
  } catch (e) {
    console.log(e);
    yield handleFail();
  }
}

function* fetchPlotSearchSubtypesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchPlotSearchSubtypesRequest);

    switch (statusCode) {
      case 200:
        const subTypes = bodyAsJson.results;
        yield put(receivePlotSearchSubtypes(subTypes));
        break;
      case 403:
        yield put(plotSearchSubtypesNotFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson, get: 'plot_search_subtype'})));
        break;
      default:
        yield put(plotSearchSubtypesNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch plot search subtypes with error "%s"', error);
    yield put(plotSearchSubtypesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchApplicationRelatedFormSaga({payload: id}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchFormRequest, id);

    switch (statusCode) {
      case 200:
        yield put(receiveApplicationRelatedForm(bodyAsJson));
        yield put(fetchApplicationRelatedPlotSearch(bodyAsJson.plot_search_id));
        break;
      default:
        yield put(applicationRelatedFormNotFound());
        displayUIMessage({title: '', body: 'Hakemukseen liittyvää lomaketta ei löytynyt!'}, {type: 'error'});
    }
  } catch {
    yield put(applicationRelatedFormNotFound());
    displayUIMessage({title: '', body: 'Hakemukseen liittyvää lomaketta ei löytynyt!'}, {type: 'error'});
  }
}

function* fetchApplicationRelatedPlotSearchSaga({payload: id}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSinglePlotSearch, id);
    switch (statusCode) {
      case 200:
        yield put(receiveApplicationRelatedPlotSearch(bodyAsJson));
        break;
      case 404:
        yield put(applicationRelatedPlotSearchNotFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
      default:
        yield put(applicationRelatedPlotSearchNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch plot search with error "%s"', error);
    yield put(applicationRelatedPlotSearchNotFound());
    yield put(receiveError(error));
  }
}

function* fetchApplicationRelatedAttachmentsSaga({payload: id}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSinglePlotApplicationAttachments, id);

    switch (statusCode) {
      case 200:
        yield put(receiveApplicationRelatedAttachments(bodyAsJson));
        break;
      default:
        yield put(applicationRelatedAttachmentsNotFound());
        displayUIMessage({title: '', body: 'Hakemuksen liitteitä ei löytynyt!'}, {type: 'error'});
    }
  } catch (e) {
    yield put(applicationRelatedAttachmentsNotFound());
    displayUIMessage({title: '', body: 'Hakemuksen liitteitä ei löytynyt!'}, {type: 'error'});
  }
}


function* fetchPendingUploadsSaga(): Generator<any, any, any> {
  try {
    const {response, bodyAsJson} = yield call(fetchPendingUploadsRequest);

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

function* deleteUploadSaga({payload}: DeleteUploadAction): Generator<any, any, any> {
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

function* uploadFileSaga({payload}: UploadFileAction): Generator<any, any, any> {
  try {
    const {path, callback, fileData} = payload;

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

function* fetchAttachmentAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttachmentAttributesRequest);

    switch(statusCode) {
      case 200:
        const attributes = {
          ...bodyAsJson.fields,
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

function* fetchApplicantInfoCheckAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchApplicantInfoCheckAttributesRequest);

    switch(statusCode) {
      case 200:
        const attributes = {
          ...bodyAsJson.fields,
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

function* editApplicantInfoCheckItemSaga({payload: infoCheck}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(editApplicantInfoCheckItemRequest, infoCheck);

    switch (statusCode) {
      case 200:
      case 201:
        const currentPlotApplication = yield select(getCurrentPlotApplication);

        yield put(receiveUpdatedApplicantInfoCheckItem(bodyAsJson));
        yield put(fetchSinglePlotApplication(currentPlotApplication.id));
        displayUIMessage({title: '', body: 'Käsittelytieto tallennettu'});
        break;
      default:
        yield put(applicantInfoCheckUpdateFailed(infoCheck.id));
        displayUIMessage({title: '', body: 'Käsittelytiedon tallennus epäonnistui'}, {type: 'error'});
    }
  } catch(e) {
    yield put(applicantInfoCheckUpdateFailed(infoCheck.id));
    console.log(e);
    displayUIMessage({title: '', body: 'Käsittelytiedon tallennus epäonnistui'}, {type: 'error'});
  }
}

function* editTargetInfoCheckItemSaga({payload: infoCheck}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(editTargetInfoCheckItemRequest, infoCheck);

    switch (statusCode) {
      case 200:
      case 201:
        const currentPlotApplication = yield select(getCurrentPlotApplication);

        yield put(receiveUpdatedTargetInfoCheckItem(bodyAsJson));
        yield put(fetchSinglePlotApplication(currentPlotApplication.id));
        displayUIMessage({title: '', body: 'Käsittelytieto tallennettu'});
        break;
      default:
        yield put(targetInfoCheckUpdateFailed(infoCheck.id));
        displayUIMessage({title: '', body: 'Käsittelytiedon tallennus epäonnistui'}, {type: 'error'});
    }
  } catch(e) {
    yield put(targetInfoCheckUpdateFailed(infoCheck.id));
    console.log(e);
    displayUIMessage({title: '', body: 'Käsittelytiedon tallennus epäonnistui'}, {type: 'error'});
  }
}

function* uploadMeetingMemoSaga({payload}: UploadTargetInfoCheckMeetingMemoAction): Generator<any, any, any> {
  try {
    const {fileData, targetInfoCheck, callback} = payload;

    const {response: {status: statusCode}, bodyAsJson} = yield call(createMeetingMemoRequest, {
      file: fileData,
      name: fileData.name,
      targetInfoCheck,
    });

    switch (statusCode) {
      case 201:
        yield put(receiveTargetInfoCheckMeetingMemoUploaded());
        if (callback) {
          callback(bodyAsJson);
        }
        displayUIMessage({title: '', body: 'Kokousmuistio lisätty'});
        break;
      default:
        yield put(targetInfoCheckMeetingMemoUploadFailed());
        displayUIMessage({title: '', body: 'Kokousmuistion tallennus epäonnistui'}, {type: 'error'});
    }
  } catch (e) {
    console.log(e);
    yield put(targetInfoCheckMeetingMemoUploadFailed());
    displayUIMessage({title: '', body: 'Kokousmuistion tallennus epäonnistui'}, {type: 'error'});
    throw e;
  }
}

function* deleteMeetingMemoSaga({payload}: DeleteTargetInfoCheckMeetingMemoAction): Generator<any, any, any> {
  try {
    const {file, callback} = payload;
    const {response: {status: statusCode}} = yield call(deleteMeetingMemoRequest, file.id);

    switch (statusCode) {
      case 200:
      case 204:
        yield put(receiveFileOperationFinished());
        if (callback) {
          callback();
        }
        displayUIMessage({title: '', body: 'Kokousmuistio poistettu'});
        break;
      default:
        yield put(pendingUploadsNotFound());
        displayUIMessage({title: '', body: 'Kokousmuistion poistaminen epäonnistui'}, {type: 'error'});
    }
  } catch (e) {
    console.error(e);
    yield put(pendingUploadsNotFound());
    displayUIMessage({title: '', body: 'Kokousmuistion poistaminen epäonnistui'}, {type: 'error'});
    throw e;
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/plotApplications/FETCH_ALL', fetchPlotApplicationsSaga);
      yield takeLatest('mvj/plotApplications/FETCH_SINGLE', fetchSinglePlotApplicationSaga);
      yield takeLatest('mvj/plotApplications/FETCH_BY_BBOX', fetchPlotApplicationsByBBoxSaga);
      yield takeLatest('mvj/plotApplications/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/plotApplications/CREATE', createPlotApplicationSaga);
      yield takeLatest('mvj/plotApplications/EDIT', editPlotApplicationSaga);
      yield takeLatest('mvj/plotApplications/FETCH_PLOT_SEARCH_SUB_TYPES', fetchPlotSearchSubtypesSaga);
      yield takeLatest('mvj/plotApplications/FETCH_FORM', fetchApplicationRelatedFormSaga);
      yield takeLatest('mvj/plotApplications/FETCH_PLOT_SEARCH', fetchApplicationRelatedPlotSearchSaga);
      yield takeLatest('mvj/plotApplications/FETCH_ATTACHMENTS', fetchApplicationRelatedAttachmentsSaga);
      yield takeLatest('mvj/plotApplications/FETCH_ATTACHMENT_ATTRIBUTES', fetchAttachmentAttributesSaga);
      yield takeLatest('mvj/plotApplications/FETCH_APPLICANT_INFO_CHECK_ATTRIBUTES', fetchApplicantInfoCheckAttributesSaga);
      yield takeLatest('mvj/plotApplications/FETCH_PENDING_UPLOADS', fetchPendingUploadsSaga);
      yield takeEvery('mvj/plotApplications/UPLOAD_FILE', uploadFileSaga);
      yield takeEvery('mvj/plotApplications/DELETE_UPLOAD', deleteUploadSaga);
      yield takeEvery('mvj/plotApplications/UPLOAD_MEETING_MEMO', uploadMeetingMemoSaga);
      yield takeEvery('mvj/plotApplications/DELETE_MEETING_MEMO', deleteMeetingMemoSaga);
      yield takeEvery('mvj/plotApplications/EDIT_APPLICANT_INFO_CHECK_ITEM', editApplicantInfoCheckItemSaga);
      yield takeEvery('mvj/plotApplications/EDIT_TARGET_INFO_CHECK_ITEM', editTargetInfoCheckItemSaga);
    }),
  ]);
}
