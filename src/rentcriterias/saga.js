// @flow

import {takeLatest} from 'redux-saga';
import {fork, put} from 'redux-saga/effects';
import {push} from 'react-router-redux';

import {displayUIMessage} from '$util/helpers';
import mockData from './mock-data.json';
import mockCriteria from './mock-data-single-criteria.json';
import {getRouteById} from '../root/routes';

import {
  hideEditMode,
  receiveRentCriterias,
  receiveSingleRentCriteria,
} from './actions';

function* createRentCriteriasSaga({payload: criteria}): Generator<> {
  // TODO: Integrate with API
  const dummyId = 1;
  console.log(criteria);
  yield put(receiveSingleRentCriteria(criteria));
  yield put(hideEditMode());
  displayUIMessage({title: 'Vuokrausperuste luotu', body: 'Vuokrausperuste on luotu onnistuneesti'});
  yield put(push(`${getRouteById('rentcriterias')}/${dummyId}`));
}

function* editRentCriteriasSaga({payload: criteria}): Generator<> {
  // TODO: Integrate with API
  yield put(receiveSingleRentCriteria(criteria));
  yield put(hideEditMode());
  displayUIMessage({title: 'Vuokrausperuste tallennettu', body: 'Vuokrausperuste on tallennettu onnistuneesti'});
}

function* fetchRentCriteriasSaga({payload: search}): Generator<> {
  // TODO: Integrate with API
  console.log(search);
  yield put(receiveRentCriterias(mockData));
}

function* fetchSingleRentCriteriaSaga(): Generator<> {
  // TODO: Integrate with API
  yield put(receiveSingleRentCriteria(mockCriteria));
}


export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/rentcriteria/CREATE', createRentCriteriasSaga);
      yield takeLatest('mvj/rentcriteria/EDIT', editRentCriteriasSaga);
      yield takeLatest('mvj/rentcriteria/FETCH_ALL', fetchRentCriteriasSaga);
      yield takeLatest('mvj/rentcriteria/FETCH_SINGLE', fetchSingleRentCriteriaSaga);
    }),
  ];
}
