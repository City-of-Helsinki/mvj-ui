// @flow

import {takeLatest, takeEvery} from 'redux-saga';
import {call, fork, put} from 'redux-saga/effects';
import get from 'lodash/get';
import {SubmissionError} from 'redux-form';

import {
  receiveLeases,
  notFound,
  receiveSingleLease,
  receiveAttributes,
  receiveAreas,
  receiveInvoices,
  fetchLeases as fetchLeasesAction,
} from './actions';

import {
  fetchLeases,
  fetchSingleLease,
  createLease,
  editLease,
  fetchAttributes,
  fetchAreas,
  fetchInvoices,
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

function* fetchAreasSaga(): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAreas);

    switch (statusCode) {
      case 200:
        yield put(receiveAreas(bodyAsJson));
        break;
      case 404:
      case 500:
        break;
    }
  } catch (error) {
    console.error('Failed to fetch areas with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* fetchInvoicesSaga({payload: lease}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchInvoices, lease);

    switch (statusCode) {
      case 200:
        yield put(receiveInvoices(bodyAsJson));
        break;
      case 404:
      case 500:
        break;
    }
  } catch (error) {
    console.error('Failed to fetch invoices with error "%s"', error);
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

function* createLeaseSaga({payload: lease}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(createLease, lease);

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
    console.error('Failed to create lease with error "%s"', error);
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
    console.error('Failed to edit lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/leases/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/leases/FETCH_AREAS', fetchAreasSaga);
      yield takeLatest('mvj/leases/FETCH_INVOICES', fetchInvoicesSaga);
      yield takeEvery('mvj/leases/FETCH_ALL', fetchLeasesSaga);
      yield takeEvery('mvj/leases/FETCH_SINGLE', fetchSingleLeaseSaga);
      yield takeLatest('mvj/leases/CREATE', createLeaseSaga);
      yield takeLatest('mvj/leases/EDIT', editLeaseSaga);
    }),
  ];
}
