// @flow

import {takeLatest} from 'redux-saga';
import {call, fork, put} from 'redux-saga/effects';
import {push} from 'react-router-redux';

import {displayUIMessage} from '$util/helpers';
import mockCriteria from './mock-data-single-criteria.json';
import {getRouteById} from '../root/routes';

import {
  hideEditMode,
  notFound,
  receiveAttributes,
  receiveRentBasisList,
  receiveSingleRentCriteria,
} from './actions';
import {
  fetchAttributes,
  fetchRentBasisList,
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

function* fetchSingleRentCriteriaSaga(): Generator<> {
  // TODO: Integrate with API
  yield put(receiveSingleRentCriteria(mockCriteria));
}

function* createRentCriteriasSaga({payload: criteria}): Generator<> {
  // TODO: Integrate with API
  const dummyId = 1;

  yield put(receiveSingleRentCriteria(criteria));
  yield put(hideEditMode());
  displayUIMessage({title: 'Vuokrausperuste luotu', body: 'Vuokrausperuste on luotu onnistuneesti'});
  yield put(push(`${getRouteById('rentbasis')}/${dummyId}`));
}

function* editRentCriteriasSaga({payload: criteria}): Generator<> {
  // TODO: Integrate with API
  yield put(receiveSingleRentCriteria(criteria));
  yield put(hideEditMode());
  displayUIMessage({title: 'Vuokrausperuste tallennettu', body: 'Vuokrausperuste on tallennettu onnistuneesti'});
}

export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/rentbasis/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/rentbasis/FETCH_ALL', fetchRentBasisListSaga);
      yield takeLatest('mvj/rentbasis/CREATE', createRentCriteriasSaga);
      yield takeLatest('mvj/rentbasis/EDIT', editRentCriteriasSaga);

      yield takeLatest('mvj/rentbasis/FETCH_SINGLE', fetchSingleRentCriteriaSaga);
    }),
  ];
}
