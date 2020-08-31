// @flow
import {all, fork, put, takeLatest, call} from 'redux-saga/effects';
import {push} from 'react-router-redux';
import {SubmissionError} from 'redux-form';

import {
  hideEditMode,
  receiveAttributes,
  receivePropertyList,
  receiveSingleProperty,
  receiveMethods,
  attributesNotFound,
  notFound,
  receiveIsSaveClicked,
} from './actions';
import {displayUIMessage} from '$util/helpers';
import {receiveError} from '$src/api/actions';
import {getRouteById, Routes} from '$src/root/routes';
import attributesMockData from './attributes-mock-data.json';
import mockData from './mock-data.json';

import {fetchAttributes, createPlotSearch, fetchPlotSearches, fetchSinglePlotSearch} from './requests';

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttributes);

    switch (statusCode) {
      case 200:
        const attributes = {...bodyAsJson.fields, application_base: attributesMockData.fields.application_base};
        const methods = bodyAsJson.methods;

        yield put(receiveAttributes(attributes));
        yield put(receiveMethods(methods));
        break;
      default:
        yield put(attributesNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchPropertySaga({payload: search}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchPlotSearches, search);

    switch (statusCode) {
      case 200:
        yield put(receivePropertyList({
          count: bodyAsJson.count,
          results: bodyAsJson.results.map(result => ({...result, application_base: mockData[0].application_base})),
        }));
        break;
      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch plot searches with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchSinglePropertySaga({payload: id}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSinglePlotSearch, id);
    switch (statusCode) {
      case 200:
        yield put(receiveSingleProperty({...bodyAsJson, application_base: mockData[0].application_base}));
        break;
      case 404:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
      default:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch plot search with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* createPropertySaga({payload: plotSearch}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(createPlotSearch, plotSearch);

    switch (statusCode) {
      case 201:
        yield put(push(`${getRouteById(Routes.PROPERTY)}/${bodyAsJson.id}`));
        yield put(receiveIsSaveClicked(false));
        displayUIMessage({title: '', body: 'Tonttihaku luotu'});
        break;
      case 400:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to create plot search with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* editPropertySaga({payload: property}): Generator<any, any, any> {
  yield put(receiveSingleProperty(property));
  yield put(hideEditMode());
  displayUIMessage({title: '', body: 'Tonttihaku tallennettu'});
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/property/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/property/FETCH_ALL', fetchPropertySaga);
      yield takeLatest('mvj/property/FETCH_SINGLE', fetchSinglePropertySaga);
      yield takeLatest('mvj/property/CREATE', createPropertySaga);
      yield takeLatest('mvj/property/EDIT', editPropertySaga);
    }),
  ]);
}
