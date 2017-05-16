// @flow

import {takeLatest} from 'redux-saga';
import {call, fork, put} from 'redux-saga/effects';
import get from 'lodash/get';

import {receiveIdentifiers} from './actions';
import {fetchIdentifiers} from './requests';
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

export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/lease/FETCH_IDENTIFIERS', fetchIdentifiersSaga);
    }),
  ];
}
