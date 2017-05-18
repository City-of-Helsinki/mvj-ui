// @flow

import {takeLatest, takeEvery} from 'redux-saga';
import {call, fork, put} from 'redux-saga/effects';
import get from 'lodash/get';
import {SubmissionError} from 'redux-form';

import {
  receiveLeases,
  notFound,
  receiveSingleLease,
  receiveIdentifiers,
  fetchLeases as fetchLeasesAction,
} from './actions';
import {fetchLeases, fetchSingleLease, createLease, editLease, fetchIdentifiers} from './requests';
import {receiveError} from '../api/actions';

function* fetchIdentifiersSaga(): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchIdentifiers);
    const identifiers = bodyAsJson.actions && {
      type: get(bodyAsJson.actions.POST, 'identifier_type.choices'),
      municipality: get(bodyAsJson.actions.POST, 'identifier_municipality.choices'),
      district: get(bodyAsJson.actions.POST, 'identifier_district.choices'),
    };

    switch (statusCode) {
      case 200:
        yield put(receiveIdentifiers(identifiers));
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

function* fetchLeasesSaga(): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchLeases);

    switch (statusCode) {
      case 200:
        yield put(receiveLeases(bodyAsJson));
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

function* fetchSingleLeaseSaga({payload: id}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSingleLease, id);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleLease(bodyAsJson));
        break;
      case 404:
        yield put(notFound());
        yield put(receiveError(new Error(`404: ${bodyAsJson.detail}`)));
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

function* createLeaseSaga({payload: application}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(createLease, application);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleLease(bodyAsJson));
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
    console.error('Failed to create application with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* editLeaseSaga({payload: application}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(editLease, application);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleLease(bodyAsJson));
        yield put(fetchLeasesAction());
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
    console.error('Failed to edit application with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/leases/FETCH_IDENTIFIERS', fetchIdentifiersSaga);
      yield takeEvery('mvj/leases/FETCH_ALL', fetchLeasesSaga);
      yield takeEvery('mvj/leases/FETCH_SINGLE', fetchSingleLeaseSaga);
      yield takeLatest('mvj/leases/CREATE', createLeaseSaga);
      yield takeLatest('mvj/leases/EDIT', editLeaseSaga);
    }),
  ];
}
