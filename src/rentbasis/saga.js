// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';
import {push} from 'react-router-redux';
import {SubmissionError} from 'redux-form';

import {getRouteById} from '../root/routes';

import {
  hideEditMode,
  notFound,
  receiveAttributes,
  receiveRentBasisList,
  receiveSingleRentBasis,
} from './actions';
import {
  createRentBasis,
  editRentBasis,
  fetchAttributes,
  fetchRentBasisList,
  fetchSingleRentBasis,
} from './requests';
import {receiveError} from '../api/actions';

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttributes);
    const attributes = bodyAsJson.fields;

    switch (statusCode) {
      case 200:
        yield put(receiveAttributes(attributes));
        break;
      case 404:
      case 500:
        break;
    }
  } catch (error) {
    console.error('Failed to fetch rent basis attributes with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* fetchRentBasisListSaga({payload: search}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchRentBasisList, search);
    switch (statusCode) {
      case 200:
        yield put(receiveRentBasisList(bodyAsJson));
        break;
      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch rent basis list with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchSingleRentBasisSaga({payload: id}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSingleRentBasis, id);
    switch (statusCode) {
      case 200:
        yield put(receiveSingleRentBasis(bodyAsJson));
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
    console.error('Failed to fetch rent basis with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* createRentBasisSaga({payload: rentBasis}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(createRentBasis, rentBasis);

    switch (statusCode) {
      case 201:
        yield put(push(`${getRouteById('rentbasis')}/${bodyAsJson.id}`));
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
    console.error('Failed to create rent basis with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* editRentBasisSaga({payload: rentBasis}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(editRentBasis, rentBasis);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleRentBasis(bodyAsJson));
        yield put(hideEditMode());
        break;
      case 400:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson, _error: 'Virhe'})));
        break;
      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to edit rent basis with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/rentbasis/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/rentbasis/FETCH_ALL', fetchRentBasisListSaga);
      yield takeLatest('mvj/rentbasis/CREATE', createRentBasisSaga);
      yield takeLatest('mvj/rentbasis/EDIT', editRentBasisSaga);

      yield takeLatest('mvj/rentbasis/FETCH_SINGLE', fetchSingleRentBasisSaga);
    }),
  ]);
}
