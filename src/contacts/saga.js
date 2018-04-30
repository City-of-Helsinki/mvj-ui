// @flow

import {takeLatest} from 'redux-saga';
import {call, fork, put} from 'redux-saga/effects';
import {push} from 'react-router-redux';
import {SubmissionError} from 'redux-form';
import get from 'lodash/get';

import {displayUIMessage} from '$util/helpers';
import {getRouteById} from '../root/routes';

import {
  hideEditMode,
  receiveAttributes,
  receiveContacts,
  receiveCompleteContactList,
  receiveLessors,
  receiveSingleContact,
  notFound,
} from './actions';

import {receiveError} from '$src/api/actions';

import {
  createContact,
  editContact,
  fetchAttributes,
  fetchContacts,
  fetchSingleContact,
} from './requests';

function* fetchAttributesSaga(): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttributes);
    const attributes = bodyAsJson.fields;

    switch (statusCode) {
      case 200:
        yield put(receiveAttributes(attributes));
        break;
      case 401:
      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch identifiers with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* fetchContactsSaga({payload: search}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchContacts, search);
    switch (statusCode) {
      case 200:
        yield put(receiveContacts(bodyAsJson));
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

function* fetchCompleteContactListSaga({payload: search}): Generator<> {
  try {
    let results = [];
    let {response: {status: statusCode}, bodyAsJson: body} = yield call(fetchContacts, search);
    results = get(body, 'results', []);
    while(statusCode === 200 && get(body, 'next')) {
      const next = get(body, 'next');
      const {response: {status}, bodyAsJson} = yield call(fetchContacts, `?${next.split('?').pop()}`);
      statusCode = status;
      body = bodyAsJson;
      results = [...results, ...get(body, 'results', [])];
    }

    switch (statusCode) {
      case 200:
        yield put(receiveCompleteContactList(results));
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

function* fetchSingleContactSaga({payload: id}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSingleContact, id);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleContact(bodyAsJson));
        break;
      case 401:
      case 404:
        break;
      case 500:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch leases with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* createContactSaga({payload: contact}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(createContact, contact);

    switch (statusCode) {
      case 201:
        yield put(push(`${getRouteById('contacts')}/${bodyAsJson.id}`));
        displayUIMessage({title: 'Asiakas tallennettu', body: 'Asiakas on tallennettu onnistuneesti'});
        break;
      case 400:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to create contact with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* editContactSaga({payload: contact}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(editContact, contact);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleContact(bodyAsJson));
        yield put(hideEditMode());
        displayUIMessage({title: 'Asiakas tallennettu', body: 'Asiakas on tallennettu onnistuneesti'});
        break;
      case 400:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to edit contact with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchLessorsSaga(): Generator<> {
  try {
    let {response: {status: statusCode}, bodyAsJson: body} = yield call(fetchContacts, '?is_lessor=true&limit=500');
    let lessors = body.results;
    while(statusCode === 200 && body.next) {
      const {response: {status}, bodyAsJson} = yield call(fetchContacts, `?${body.next.split('?').pop()}`);
      statusCode = status;
      body = bodyAsJson;
      lessors = [...lessors, ...body.results];
    }

    switch (statusCode) {
      case 200:
        yield put(receiveLessors(lessors));
        break;
      case 404:
      case 500:
        break;
    }
  } catch (error) {
    console.error('Failed to fetch lessors with error "%s"', error);
    yield put(receiveError(error));
  }
}

export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/contacts/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/contacts/FETCH_ALL', fetchContactsSaga);
      yield takeLatest('mvj/contacts/FETCH_COMPLETE', fetchCompleteContactListSaga);
      yield takeLatest('mvj/contacts/FETCH_SINGLE', fetchSingleContactSaga);
      yield takeLatest('mvj/contacts/FETCH_LESSORS', fetchLessorsSaga);
      yield takeLatest('mvj/contacts/CREATE', createContactSaga);
      yield takeLatest('mvj/contacts/EDIT', editContactSaga);
    }),
  ];
}
