// @flow

import {takeLatest} from 'redux-saga';
import {call, fork, put} from 'redux-saga/effects';
import get from 'lodash/get';
import {SubmissionError} from 'redux-form';
// import mockData from './mock-data.json';

import {
  receiveLeases,
  receiveSingleLease,
  notFound,
  receiveAttributes,
} from './actions';

import {
  fetchLeases,
  fetchSingleLease,
  editLease,
  fetchAttributes,
} from './requests';

import {receiveError} from '../api/actions';

function* fetchAttributesSaga(): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttributes);
    const attributes = bodyAsJson.fields && {
      identifiers: {
        type: get(bodyAsJson.fields, 'identifier_type.choices'),
        municipality: get(bodyAsJson.fields, 'identifier_municipality.choices'),
        district: get(bodyAsJson.fields, 'identifier_district.choices'),
      },
      ...bodyAsJson.fields,
    };

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
    // yield put(receiveLeases(mockData.leases));
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

function* editLeaseSaga({payload: lease}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(editLease, lease);

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
    console.error('Failed to edit lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/leasesbeta/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/leasesbeta/FETCH_ALL', fetchLeasesSaga);
      yield takeLatest('mvj/leasesbeta/FETCH_SINGLE', fetchSingleLeaseSaga);
      yield takeLatest('mvj/leasesbeta/EDIT', editLeaseSaga);
    }),
  ];
}
