// @flow

import {all, fork, put, takeLatest, takeEvery, call, select} from 'redux-saga/effects';
import {SubmissionError} from "redux-form";


import {displayUIMessage} from '$src/util/helpers';
import {
  receivePlotApplicationsList,
  receiveMethods,
  receiveAttributes,
  receiveSinglePlotApplication,
  hideEditMode,
  notFoundByBBox,
  receivePlotApplicationsByBBox,
  receiveIsSaveClicked,
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
  fetchInfoCheckAttributes,
  receiveInfoCheckAttributes,
  infoCheckAttributesNotFound,
  receiveUpdatedInfoCheckItem,
  infoCheckUpdateFailed
} from './actions';
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
  fetchInfoCheckAttributesRequest,
  editInfoCheckItemRequest
} from './requests';
import {
  fetchFormRequest,
  fetchSinglePlotSearch
} from "../plotSearch/requests";
import {
  fetchFormAttributes,
} from "../plotSearch/actions";
import {push} from "react-router-redux";
import {getRouteById, Routes} from "../root/routes";
import type {DeleteUploadAction, PlotApplication, UploadFileAction} from "./types";
import {getCurrentPlotApplication} from "./selectors";

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
        yield put(fetchInfoCheckAttributes());
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
        displayUIMessage({title: '', body: 'Hakemuksen tallennus epäonnistui'}, { type: 'error' });
    }
  } catch(e) {
    yield put(receivePlotApplicationSaveFailed());
    console.log(e);
    displayUIMessage({title: '', body: 'Hakemuksen tallennus epäonnistui'}, { type: 'error' });
  }
}

function* editPlotApplicationSaga({payload: plotApplication}): Generator<any, any, any> {
  const handleFail = function*() {
    yield put(receivePlotApplicationSaveFailed());
    displayUIMessage({title: '', body: 'Hakemuksen tallennus epäonnistui'}, { type: 'error' });
  }

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

function* fetchApplicationRelatedFormSaga({ payload: id }): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchFormRequest, id);

    switch (statusCode) {
      case 200:
        yield put(receiveApplicationRelatedForm(bodyAsJson));
        yield put(fetchApplicationRelatedPlotSearch(bodyAsJson.plot_search_id));
        break;
      default:
        yield put(applicationRelatedFormNotFound());
        displayUIMessage({title: '', body: 'Hakemukseen liittyvää lomaketta ei löytynyt!'}, { type: 'error' });
    }
  } catch {
    yield put(applicationRelatedFormNotFound());
    displayUIMessage({title: '', body: 'Hakemukseen liittyvää lomaketta ei löytynyt!'}, { type: 'error' });
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

function* fetchApplicationRelatedAttachmentsSaga({ payload: id }): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSinglePlotApplicationAttachments, id);

    switch (statusCode) {
      case 200:
        yield put(receiveApplicationRelatedAttachments(bodyAsJson));
        break;
      default:
        yield put(applicationRelatedAttachmentsNotFound());
        displayUIMessage({title: '', body: 'Hakemuksen liitteitä ei löytynyt!'}, { type: 'error' });
    }
  } catch (e) {
    yield put(applicationRelatedAttachmentsNotFound());
    displayUIMessage({title: '', body: 'Hakemuksen liitteitä ei löytynyt!'}, { type: 'error' });
  }
}


function* fetchPendingUploadsSaga(): Generator<any, any, any> {
  try {
    const { response, bodyAsJson } = yield call(fetchPendingUploadsRequest);

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

function* deleteUploadSaga({ payload }: DeleteUploadAction): Generator<any, any, any> {
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

function* uploadFileSaga({ payload }: UploadFileAction): Generator<any, any, any> {
  try {
    yield call(uploadFileRequest, payload);

    yield put(receiveFileOperationFinished());
    if (payload.answer) {
      yield put(fetchApplicationRelatedAttachments(payload.answer));
    } else {
      yield put(fetchPendingUploads());
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

function* fetchInfoCheckAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchInfoCheckAttributesRequest);

    switch(statusCode) {
      case 200:
        const attributes = {
          ...bodyAsJson.fields,
        };

        yield put(receiveInfoCheckAttributes(attributes));
        break;
      default:
        yield put(infoCheckAttributesNotFound());
    }
  } catch (error) {
    console.error('Failed to fetch info check attributes with error "%s"', error);
    yield put(infoCheckAttributesNotFound());
    yield put(receiveError(error));
  }
}

function* editInfoCheckItemSaga({payload: infoCheck}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(editInfoCheckItemRequest, infoCheck);

    switch (statusCode) {
      case 200:
      case 201:
        const currentPlotApplication = yield select(getCurrentPlotApplication);

        yield put(receiveUpdatedInfoCheckItem(bodyAsJson));
        yield put(fetchSinglePlotApplication(currentPlotApplication.id));
        displayUIMessage({title: '', body: 'Käsittelytieto tallennettu'});
        break;
      default:
        yield put(infoCheckUpdateFailed(infoCheck.id));
        displayUIMessage({title: '', body: 'Käsittelytiedon tallennus epäonnistui'}, { type: 'error' });
    }
  } catch(e) {
    yield put(infoCheckUpdateFailed(infoCheck.id));
    console.log(e);
    displayUIMessage({title: '', body: 'Käsittelytiedon tallennus epäonnistui'}, { type: 'error' });
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
      yield takeLatest('mvj/plotApplications/FETCH_INFO_CHECK_ATTRIBUTES', fetchInfoCheckAttributesSaga);
      yield takeLatest('mvj/plotApplications/UPLOAD_FILE', uploadFileSaga);
      yield takeLatest('mvj/plotApplications/FETCH_PENDING_UPLOADS', fetchPendingUploadsSaga);
      yield takeLatest('mvj/plotApplications/DELETE_UPLOAD', deleteUploadSaga);
      yield takeEvery('mvj/plotApplications/EDIT_INFO_CHECK_ITEM', editInfoCheckItemSaga);
    }),
  ]);
}
