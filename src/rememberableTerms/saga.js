// @flow
import {all, fork, put, select, takeLatest} from 'redux-saga/effects';
import get from 'lodash/get';

import mockData from './mock-data.json';
import {hideEditMode, receiveRememberableTermList} from './actions';
import {getRememberableTermList} from './selectors';
import {displayUIMessage} from '$util/helpers';

let tempId = 100;

function* fetchRememberableTermListSaga({payload: search}): Generator<any, any, any> {
  console.log('FetchRememberableTermListSaga: ', search);
  yield put(receiveRememberableTermList(mockData));
}

function* createRememberableTermSaga({payload: terms}): Generator<any, any, any> {
  const rememberableTerms = yield select(getRememberableTermList);
  terms.properties.id = tempId ++;
  const features = [...rememberableTerms.features, ...terms];
  rememberableTerms.features = features;

  yield put(receiveRememberableTermList(rememberableTerms));
  yield put(hideEditMode());
  displayUIMessage({title: 'Muistettava ehto tallennettu', body: 'Muistettava ehto on tallennettu onnistuneesti'});
}

function* deleteRememberableTermSaga({payload: id}): Generator<any, any, any> {
  const rememberableTerms = yield select(getRememberableTermList);
  const filteredTerms = rememberableTerms.features.filter((term) => term.properties.id !== id);
  rememberableTerms.features = filteredTerms;

  yield put(receiveRememberableTermList(rememberableTerms));
  yield put(hideEditMode());
  displayUIMessage({title: 'Muistettava ehto poistettu', body: 'Muistettava ehto on poistettu onnistuneesti'});
}

function* editRememberableTermSaga({payload: terms}): Generator<any, any, any> {
  const id = get(terms, '[0].properties.id');
  const rememberableTerms = yield select(getRememberableTermList);
  const filteredTerms = rememberableTerms.features.filter((term) => term.properties.id !== id);
  const features = [...filteredTerms, ...terms];
  rememberableTerms.features = features;

  yield put(receiveRememberableTermList(rememberableTerms));
  yield put(hideEditMode());
  displayUIMessage({title: 'Muistettava ehto tallennettu', body: 'Muistettava ehto on tallennettu onnistuneesti'});
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/rememberableterm/FETCH_ALL', fetchRememberableTermListSaga);
      yield takeLatest('mvj/rememberableterm/CREATE', createRememberableTermSaga);
      yield takeLatest('mvj/rememberableterm/DELETE', deleteRememberableTermSaga);
      yield takeLatest('mvj/rememberableterm/EDIT', editRememberableTermSaga);
    }),
  ]);
}
