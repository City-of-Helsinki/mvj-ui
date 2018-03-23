// @flow

import {takeLatest} from 'redux-saga';
import {call, fork, put} from 'redux-saga/effects';


import {
  receiveContacts,
  notFound,
} from './actions';

import {receiveError} from '$src/api/actions';

import {

  fetchContacts,
} from './requests';

function* fetchContactsSaga({payload: search}): Generator<> {
  try {
    console.log('search', search);
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchContacts, search);
    const contacts = bodyAsJson.results;
    switch (statusCode) {
      case 200:
        yield put(receiveContacts(contacts));
        break;
      case 401:
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

export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/contacts/FETCH_ALL', fetchContactsSaga);
    }),
  ];
}
