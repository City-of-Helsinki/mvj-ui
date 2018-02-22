// @flow

import {takeLatest} from 'redux-saga';
import {fork, put} from 'redux-saga/effects';

import mockData from './mock-data.json';

import {
  receiveRentCriterias,
} from './actions';


function* fetchRentCriteriasSaga({payload: search}): Generator<> {
  console.log('search', search);
  yield put(receiveRentCriterias(mockData));
}


export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/rentcriterias/FETCH_ALL', fetchRentCriteriasSaga);
    }),
  ];
}
