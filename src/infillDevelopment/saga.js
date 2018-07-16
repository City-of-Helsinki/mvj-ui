// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';
import {push} from 'react-router-redux';
import {SubmissionError} from 'redux-form';

import {
  hideEditMode,
  notFound,
  receiveInfillDevelopmentAttributes,
  receiveInfillDevelopments,
  receiveSingleInfillDevelopment,
} from './actions';
import {receiveError} from '$src/api/actions';
import {fetchAttributes, fetchInfillDevelopments, fetchSingleInfillDevelopment} from './requests';
import {getRouteById} from '$src/root/routes';

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttributes);
    const attributes = bodyAsJson.fields;

    switch (statusCode) {
      case 200:
        yield put(receiveInfillDevelopmentAttributes(attributes));
        break;
      case 401:
      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch identifiers with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* fetchInfillDevelopmentsSaga({payload: search}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchInfillDevelopments, search);
    switch (statusCode) {
      case 200:
        yield put(receiveInfillDevelopments(bodyAsJson));
        break;
      case 401:
      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch infill development compensations with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchSingleInfillDevelopmentSaga({payload: id}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSingleInfillDevelopment, id);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleInfillDevelopment(bodyAsJson));
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
    console.error('Failed to fetch single infill development compensation with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
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
