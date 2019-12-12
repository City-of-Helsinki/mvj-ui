// @flow
import {all, fork, put, takeLatest} from 'redux-saga/effects';

import {
  receiveAttributes,
  receivePropertyList,
  receiveSingleProperty,
} from './actions';


import attributesMockData from './attributes-mock-data.json';
import mockData from './mock-data.json';

function* fetchAttributesSaga(): Generator<any, any, any> {
  const attributes = attributesMockData.fields;
  yield put(receiveAttributes(attributes));
}

function* fetchPropertySaga({payload: search}): Generator<any, any, any> {
  console.log(search);
  const bodyAsJson = {
    count: 1,
    results: mockData,
  };
  yield put(receivePropertyList(bodyAsJson));
}

function* fetchSinglePropertySaga({payload: propertyId}): Generator<any, any, any> {
  console.log(propertyId);
  const bodyAsJson = mockData[0];
  yield put(receiveSingleProperty(bodyAsJson));
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/property/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/property/FETCH_ALL', fetchPropertySaga);
      yield takeLatest('mvj/property/FETCH_SINGLE', fetchSinglePropertySaga);
    }),
  ]);
}
