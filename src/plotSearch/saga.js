// @flow
import {all, fork, put, takeLatest, call} from 'redux-saga/effects';
import {push} from 'react-router-redux';
import {SubmissionError} from 'redux-form';

import {displayUIMessage, getSearchQuery, getUrlParams} from '$src/util/helpers';
import {
  hideEditMode,
  receiveAttributes,
  receivePlotSearchList,
  receiveSinglePlotSearch,
  receiveMethods,
  attributesNotFound,
  notFound,
  receiveIsSaveClicked,
  fetchSinglePlotSearchAfterEdit,
} from './actions';
import {receiveError} from '$src/api/actions';
import {getRouteById, Routes} from '$src/root/routes';
import attributesMockData from './attributes-mock-data.json';
import mockData from './mock-data.json';

import {fetchAttributes, createPlotSearch, fetchPlotSearches, fetchSinglePlotSearch, editPlotSearch, deletePlotSearch} from './requests';

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

function* fetchPlotSearchSaga({payload: query}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchPlotSearches, query);

    switch (statusCode) {
      case 200:
        yield put(receivePlotSearchList({
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

function* fetchSinglePlotSearchSaga({payload: id}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSinglePlotSearch, id);
    switch (statusCode) {
      case 200:
        yield put(receiveSinglePlotSearch({...bodyAsJson, application_base: mockData[0].application_base}));
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

function* createPlotSearchSaga({payload: plotSearch}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(createPlotSearch, plotSearch);

    switch (statusCode) {
      case 201:
        yield put(push(`${getRouteById(Routes.PLOT_SEARCH)}/${bodyAsJson.id}`));
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

function* editPlotSearchSaga({payload: plotSearch}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(editPlotSearch, plotSearch);
    switch (statusCode) {
      case 200:
        yield put(fetchSinglePlotSearchAfterEdit({
          id: plotSearch.id,
          callbackFunctions: [
            hideEditMode(),
            receiveIsSaveClicked(false),
            () => displayUIMessage({title: '', body: 'Tonttihaku tallennettu'}),
          ],
        }));
        break;
      case 400:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({_error: 'Server error 400', ...bodyAsJson})));
        break;
      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to edit lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchSinglePlotSearchAfterEditSaga({payload}): Generator<any, any, any> {
  try {
    const callbackFunctions = payload.callbackFunctions;
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSinglePlotSearch, payload.id);

    switch (statusCode) {
      case 200:
        yield put(receiveSinglePlotSearch({...bodyAsJson, application_base: mockData[0].application_base}));
        if(callbackFunctions) {
          for(let i = 0; i < callbackFunctions.length; i++) {
            switch (typeof callbackFunctions[i]) {
              case 'function': // Functions
                callbackFunctions[i]();
                break;
              case 'object': // Redux saga functions
                yield put(callbackFunctions[i]);
            }
          }
        }
        break;
      case 404:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch Land Use Contracts with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* deletePlotSearchSaga({payload: id}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(deletePlotSearch, id);

    switch (statusCode) {
      case 204:
        const query = getUrlParams(location.search);

        // Remove page specific url parameters when moving to landuse list page
        delete query.tab;

        yield put(push(`${getRouteById(Routes.PLOT_SEARCH)}/${getSearchQuery(query)}`));
        displayUIMessage({title: '', body: 'Tonttihaku poistettu'});
        break;
      case 400:
      case 401:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to delete landusecontract with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/plotSearch/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/plotSearch/FETCH_ALL', fetchPlotSearchSaga);
      yield takeLatest('mvj/plotSearch/FETCH_SINGLE', fetchSinglePlotSearchSaga);
      yield takeLatest('mvj/plotSearch/CREATE', createPlotSearchSaga);
      yield takeLatest('mvj/plotSearch/EDIT', editPlotSearchSaga);
      yield takeLatest('mvj/plotSearch/FETCH_SINGLE_AFTER_EDIT', fetchSinglePlotSearchAfterEditSaga);
      yield takeLatest('mvj/plotSearch/DELETE', deletePlotSearchSaga);
    }),
  ]);
}
