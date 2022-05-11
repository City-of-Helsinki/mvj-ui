// @flow

import {all, fork, put, takeLatest, call} from 'redux-saga/effects';
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
  applicationRelatedAttachmentsNotFound,
  fetchApplicationRelatedAttachments,
  receiveApplicationRelatedAttachments
} from './actions';
import {receiveError} from '$src/api/actions';

import {
  fetchPlotApplications,
  fetchSinglePlotApplication,
  fetchAttributes,
  fetchPlotSearchSubtypesRequest,
  fetchSinglePlotApplicationAttachments
} from './requests';
import {fetchFormRequest} from "../plotSearch/requests";
import {fetchFormAttributes} from "../plotSearch/actions";

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
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSinglePlotApplication, id);
    switch (statusCode) {
      case 200:
        yield put(receiveSinglePlotApplication(bodyAsJson));
        yield put(fetchApplicationRelatedForm(bodyAsJson.form));
        yield put(fetchApplicationRelatedAttachments(id));
        yield put(fetchFormAttributes(bodyAsJson.form));
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

function* editPlotApplicationSaga({payload: plotApplication}): Generator<any, any, any> {
  yield put(receiveSinglePlotApplication(plotApplication));
  yield put(hideEditMode());
  yield put(receiveIsSaveClicked(false));
  displayUIMessage({title: '', body: 'Tonttihaku tallennettu'});
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

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/plotApplications/FETCH_ALL', fetchPlotApplicationsSaga);
      yield takeLatest('mvj/plotApplications/FETCH_SINGLE', fetchSinglePlotApplicationSaga);
      yield takeLatest('mvj/plotApplications/FETCH_BY_BBOX', fetchPlotApplicationsByBBoxSaga);
      yield takeLatest('mvj/plotApplications/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/plotApplications/EDIT', editPlotApplicationSaga);
      yield takeLatest('mvj/plotApplications/FETCH_PLOT_SEARCH_SUB_TYPES', fetchPlotSearchSubtypesSaga);
      yield takeLatest('mvj/plotApplications/FETCH_FORM', fetchApplicationRelatedFormSaga);
      yield takeLatest('mvj/plotApplications/FETCH_ATTACHMENTS', fetchApplicationRelatedAttachmentsSaga);
    }),
  ]);
}
