// @flow
import {all, fork, put, takeLatest, call, takeEvery} from 'redux-saga/effects';
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
  receivePlanUnitAttributes,
  planUnitAttributesNotFound,
  receiveSinglePlanUnit,
  planUnitNotFound,
  receivePlotSearchSubtype,
  PlotSearchSubtypeNotFound,
  nullPlanUnits,
  receiveForm,
  formNotFound,
  receiveFormAttributes,
  formAttributesNotFound,
  fetchFormAttributes,
  fetchForm,
} from './actions';
import {receiveError} from '$src/api/actions';
import {getRouteById, Routes} from '$src/root/routes';
import attributesMockData from './attributes-mock-data.json';
import mockData from './mock-data.json';

import {
  fetchAttributes,
  createPlotSearch, 
  fetchPlotSearches, 
  fetchSinglePlotSearch, 
  editPlotSearch, 
  deletePlotSearch,
  fetchPlanUnitAttributes,
  fetchPlanUnit,
  fetchPlotSearchSubtypes,
  fetchFormRequest,
  fetchFormAttributesRequest,
} from './requests';

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
        yield put(fetchFormAttributes(1));
        yield put(fetchForm(1));
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
            nullPlanUnits(),
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

function* fetchPlanUnitAttributesSaga({payload: value}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchPlanUnitAttributes, value.value);
    switch (statusCode) {
      case 200:
        const attributes = bodyAsJson.fields;
        yield put(receivePlanUnitAttributes({[value.value]: attributes}));
        break;
      default:
        yield put(planUnitAttributesNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch plan unit attributes with error "%s"', error);
    yield put(planUnitAttributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchPlanUnitSaga({payload: value}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchPlanUnit, value.value);
    switch (statusCode) {
      case 200:
        yield put(receiveSinglePlanUnit({[value.value]: bodyAsJson}));
        break;
      case 404:
        yield put(planUnitNotFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
      default:
        yield put(planUnitNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch planUnit with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchPlotSearchSubtype(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchPlotSearchSubtypes);

    switch (statusCode) {
      case 200:
        const subTypes = bodyAsJson.results;
        yield put(receivePlotSearchSubtype(subTypes));
        break;
      case 403:
        yield put(PlotSearchSubtypeNotFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson, get: 'plot_search_subtype'})));
        break;
      default:
        yield put(PlotSearchSubtypeNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch plot search subtypes with error "%s"', error);
    yield put(PlotSearchSubtypeNotFound());
    yield put(receiveError(error));
  }
}

function* fetchFormSaga({payload: id}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchFormRequest, id);
    switch (statusCode) {
      case 200:
        yield put(receiveForm(bodyAsJson));
        break;
      case 404:
        yield put(formNotFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
      default:
        yield put(formNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch form with error "%s"', error);
    yield put(formNotFound());
    yield put(receiveError(error));
  }
}

function* fetchFormAttributesSaga({payload: id}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchFormAttributesRequest, id);
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
      yield takeEvery('mvj/plotSearch/FETCH_PLAN_UNIT_ATTRIBUTES', fetchPlanUnitAttributesSaga);
      yield takeEvery('mvj/plotSearch/FETCH_PLAN_UNIT', fetchPlanUnitSaga);
      yield takeEvery('mvj/plotSearch/FETCH_FORM_ATTRIBUTES', fetchFormAttributesSaga);
      yield takeEvery('mvj/plotSearch/FETCH_FORM', fetchFormSaga);
      yield takeEvery('mvj/plotSearch/FETCH_PLOT_SEARCH_SUB_TYPES', fetchPlotSearchSubtype);
    }),
  ]);
}
