
// @flow
import {all, fork, put, takeLatest} from 'redux-saga/effects';

import {
  receivePlotApplicationsList,
  receiveMethods,
  receiveAttributes,
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
      yield takeLatest('mvj/plotApplications/FETCH_ATTRIBUTES', fetchAttributesSaga);
    }),
  ]);
}
