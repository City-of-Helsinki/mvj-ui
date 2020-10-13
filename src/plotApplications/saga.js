
// @flow
import {all, fork, put, takeLatest} from 'redux-saga/effects';

import {
  receivePlotApplicationsList,
  receiveMethods,
  receiveAttributes,
  receiveSinglePlotApplication,
} from './actions';

import mockData from './mock-data.json';
import mockAttributes from './attributes-mock-data.json';

function* fetchPlotApplications({payload: query}): Generator<any, any, any> {
  console.log(query);
  yield put(receivePlotApplicationsList({
    count: 1,
    results: mockData,
  }));
}

function* fetchSinglePlotApplicationSaga({payload: id}): Generator<any, any, any> {
  const current = mockData.find(application => application.id == id);
  yield put(receiveSinglePlotApplication(current));
}

function* fetchAttributesSaga(): Generator<any, any, any> {
  const attributes = mockAttributes.fields;
  const methods = mockAttributes.methods;

  yield put(receiveAttributes(attributes));
  yield put(receiveMethods(methods));
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/plotApplications/FETCH_ALL', fetchPlotApplications);
      yield takeLatest('mvj/plotApplications/FETCH_SINGLE', fetchSinglePlotApplicationSaga);
      yield takeLatest('mvj/plotApplications/FETCH_ATTRIBUTES', fetchAttributesSaga);
    }),
  ]);
}
