// @flow

import {takeLatest} from 'redux-saga';
import {call, fork, put} from 'redux-saga/effects';
import {push} from 'react-router-redux';
import {SubmissionError} from 'redux-form';

import {displayUIMessage} from '$util/helpers';
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

function* fetchAttributesSaga(): Generator<> {
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
    console.error('Failed to fetch identifiers with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* fetchRentBasisListSaga({payload: search}): Generator<> {
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
    console.error('Failed to fetch leases with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchSingleRentBasisSaga({payload: id}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSingleRentBasis, id);
    switch (statusCode) {
      case 200:
        yield put(receiveSingleRentBasis(bodyAsJson));
        break;
      case 404:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        // yield put(receiveError(new Error(`404: ${bodyAsJson.detail}`)));
        break;
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch leases with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* createRentBasisSaga({payload: rentBasis}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(createRentBasis, rentBasis);

    switch (statusCode) {
      case 201:
        yield put(push(`${getRouteById('rentbasis')}/${bodyAsJson.id}`));
        displayUIMessage({title: 'Vuokrausperuste luotu', body: 'Vuokrausperuste on luotu onnistuneesti'});
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
    console.error('Failed to create lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* editRentBasisSaga({payload: rentBasis}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(editRentBasis, rentBasis);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleRentBasis(bodyAsJson));
        yield put(hideEditMode());
        displayUIMessage({title: 'Vuokrausperuste tallennettu', body: 'Vuokrausperuste on tallennettu onnistuneesti'});
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
    console.error('Failed to edit lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/rentbasis/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/rentbasis/FETCH_ALL', fetchRentBasisListSaga);
      yield takeLatest('mvj/rentbasis/CREATE', createRentBasisSaga);
      yield takeLatest('mvj/rentbasis/EDIT', editRentBasisSaga);

      yield takeLatest('mvj/rentbasis/FETCH_SINGLE', fetchSingleRentBasisSaga);
    }),
  ];
}
