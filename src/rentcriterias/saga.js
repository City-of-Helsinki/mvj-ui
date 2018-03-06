// @flow

import {takeLatest} from 'redux-saga';
import {fork, put} from 'redux-saga/effects';

import {displayUIMessage} from '$util/helpers';
import mockData from './mock-data.json';
import mockCriteria from './mock-data-single-criteria.json';

import {
  hideEditMode,
  receiveRentCriterias,
  receiveSingleRentCriteria,
} from './actions';


function* editRentCriteriasSaga({payload: criteria}): Generator<> {
  yield put(receiveSingleRentCriteria(criteria));
  yield put(hideEditMode());
  displayUIMessage({title: 'Vuokrausperuste', body: 'Vuokrausperuste on tallennettu onnistuneesti'});
}

function* fetchRentCriteriasSaga({payload: search}): Generator<> {
  console.log(search);
  yield put(receiveRentCriterias(mockData));
}

function* fetchSingleRentCriteriaSaga(): Generator<> {
  yield put(receiveSingleRentCriteria(mockCriteria));
}


export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/rentcriteria/EDIT', editRentCriteriasSaga);
      yield takeLatest('mvj/rentcriteria/FETCH_ALL', fetchRentCriteriasSaga);
      yield takeLatest('mvj/rentcriteria/FETCH_SINGLE', fetchSingleRentCriteriaSaga);
    }),
  ];
}
