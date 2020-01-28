// @flow
import {all, fork, put, takeLatest} from 'redux-saga/effects';
import {push} from 'react-router-redux';

import {
  hideEditMode,
  receiveAttributes,
  receivePropertyList,
  receiveSingleProperty,
} from './actions';
import {displayUIMessage} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
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

function* createPropertySaga({payload: property}): Generator<any, any, any> {
  console.log(property);
  yield put(push(`${getRouteById(Routes.PROPERTY)}/1`));
  displayUIMessage({title: '', body: 'Maankäyttösopimus luotu'});
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
