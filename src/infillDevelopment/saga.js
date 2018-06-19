// @flow
import {all, fork, put, takeLatest} from 'redux-saga/effects';
import {push} from 'react-router-redux';

import {
  hideEditMode,
  receiveInfillDevelopmentAttributes,
  receiveInfillDevelopments,
  receiveSingleInfillDevelopment,
} from './actions';
import {getRouteById} from '$src/root/routes';

import attributesMockData from './attributes-mock-data.json';
import mockData from './mock-data.json';

function* fetchAttributesSaga(): Generator<any, any, any> {
  const attributes = attributesMockData.fields;
  yield put(receiveInfillDevelopmentAttributes(attributes));
}

function* fetchInfillDevelopmentsSaga({payload: search}): Generator<any, any, any> {
  console.log(search);
  const bodyAsJson = {
    count: 1,
    results: mockData,
  };
  yield put(receiveInfillDevelopments(bodyAsJson));
}

function* fetchSingleInfillDevelopmentSaga({payload: id}): Generator<any, any, any> {
  console.log(id);
  const bodyAsJson = mockData[0];
  yield put(receiveSingleInfillDevelopment(bodyAsJson));
}

function* createInfillDevelopmentSaga({payload: infillDevelopment}): Generator<any, any, any> {
  console.log(infillDevelopment);
  yield put(push(getRouteById('infillDevelopment')));
}

function* editInfillDevelopmentSaga({payload: infillDevelopment}): Generator<any, any, any> {
  const bodyAsJson = infillDevelopment;

  yield put(receiveSingleInfillDevelopment(bodyAsJson));
  yield put(hideEditMode());
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/infillDevelopment/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/infillDevelopment/FETCH_ALL', fetchInfillDevelopmentsSaga);
      yield takeLatest('mvj/infillDevelopment/FETCH_SINGLE', fetchSingleInfillDevelopmentSaga);
      yield takeLatest('mvj/infillDevelopment/CREATE', createInfillDevelopmentSaga);
      yield takeLatest('mvj/infillDevelopment/EDIT', editInfillDevelopmentSaga);
    }),
  ]);
}
