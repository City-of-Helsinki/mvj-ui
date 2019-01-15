// @flow
import {all, call, fork, put, select, takeLatest} from 'redux-saga/effects';
import {push} from 'react-router-redux';
import {SubmissionError} from 'redux-form';

import {
  hideContactModal,
  hideEditMode,
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  receiveContacts,
  receiveContactModalSettings,
  receiveSingleContact,
  notFound,
} from './actions';
import {receiveError} from '$src/api/actions';
import {displayUIMessage} from '$util/helpers';
import {
  createContact,
  editContact,
  fetchAttributes,
  fetchContacts,
  fetchSingleContact,
} from './requests';
import {getRouteById, Routes} from '../root/routes';
import {getContactModalSettings} from './selectors';

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttributes);

    switch (statusCode) {
      case 200:
        const attributes = bodyAsJson.fields;
        const methods = bodyAsJson.methods;

        yield put(receiveAttributes(attributes));
        yield put(receiveMethods(methods));
        break;
      default:
        yield put(attributesNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch contact attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchContactsSaga({payload: search}): Generator<any, any, any> {
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
    console.error('Failed to fetch contacts with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchSingleContactSaga({payload: id}): Generator<any, any, any> {
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

function* createContactSaga({payload: contact}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(createContact, contact);

    switch (statusCode) {
      case 201:
        yield put(push(`${getRouteById(Routes.CONTACTS)}/${bodyAsJson.id}`));
        displayUIMessage({title: '', body: 'Asiakas luotu'});
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

function* editContactSaga({payload: contact}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(editContact, contact);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleContact(bodyAsJson));
        yield put(hideEditMode());
        displayUIMessage({title: '', body: 'Asiakas tallennettu'});
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

function* createContactOnModalSaga({payload: contact}): Generator<any, any, any> {
  try {
    const contactModalSettings = yield select(getContactModalSettings);
    const isSelected = contact.isSelected ? true : false;
    delete contact.isSelected;

    const {response: {status: statusCode}, bodyAsJson} = yield call(createContact, contact);

    switch (statusCode) {
      case 201:
        if (isSelected) {
          contactModalSettings.contact = bodyAsJson;
          yield put(receiveContactModalSettings(contactModalSettings));
        }
        yield put(receiveSingleContact(bodyAsJson));
        yield put(hideContactModal());
        displayUIMessage({title: '', body: 'Asiakas luotu'});
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

function* editContactOnModalSaga({payload: contact}): Generator<any, any, any> {
  try {
    const contactModalSettings = yield select(getContactModalSettings);
    const {response: {status: statusCode}, bodyAsJson} = yield call(editContact, contact);

    switch (statusCode) {
      case 200:
        contactModalSettings.contact = bodyAsJson;
        yield put(receiveContactModalSettings(contactModalSettings));
        yield put(receiveSingleContact(bodyAsJson));
        yield put(hideContactModal());
        displayUIMessage({title: '', body: 'Asiakas tallennettu'});
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

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/contacts/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/contacts/FETCH_ALL', fetchContactsSaga);
      yield takeLatest('mvj/contacts/FETCH_SINGLE', fetchSingleContactSaga);
      yield takeLatest('mvj/contacts/CREATE', createContactSaga);
      yield takeLatest('mvj/contacts/EDIT', editContactSaga);
      yield takeLatest('mvj/contacts/CREATE_ON_MODAL', createContactOnModalSaga);
      yield takeLatest('mvj/contacts/EDIT_ON_MODAL', editContactOnModalSaga);
    }),
  ]);
}
