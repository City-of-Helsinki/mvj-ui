// @flow

import {takeLatest} from 'redux-saga';
import {call, fork, put, select} from 'redux-saga/effects';
import {push} from 'react-router-redux';
import {SubmissionError} from 'redux-form';
import {displayUIMessage} from '$util/helpers';

import {
  hideContactModal,
  hideEditMode,
  receiveContactModalSettings,
  receiveCommentAttributes,
  receiveComments,
  receiveCreatedComment,
  receiveEditedComment,
  receiveAttributes,
  receiveLeases,
  receiveSingleLease,
  receiveLessors,
  receiveDecisions,
  notFound,
} from './actions';

import {getRouteById} from '../root/routes';

import {
  receiveEditedContactToCompleteList,
  receiveNewContactToCompleteList,
} from '../contacts/actions';

import {
  createContact,
  editContact,
} from '../contacts/requests';

import {
  createComment,
  editComment,
  fetchComments,
  fetchCommentAttributes,
  fetchAttributes,
  fetchLeases,
  fetchSingleLease,
  createLease,
  patchLease,
  fetchLessors,
  fetchDecisions,
} from './requests';

import {getContactModalSettings} from './selectors';

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

function* fetchLessorsSaga(): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchLessors);
    const lessors = bodyAsJson.results;

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

function* fetchDecisionsSaga({payload: search}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchDecisions, search);
    const decisions = bodyAsJson.results;

    switch (statusCode) {
      case 200:
        yield put(receiveDecisions(decisions));
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

function* fetchLeasesSaga({payload: search}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchLeases, search);
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
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        // yield put(receiveError(new Error(`404: ${bodyAsJson.detail}`)));
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
      case 201:
        yield put(push(`${getRouteById('leases')}/${bodyAsJson.id}`));
        displayUIMessage({title: 'Vuorkatunnus luotu', body: 'Vuokrautunnus on tallennettu onnistuneesti'});
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
    console.error('Failed to create lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* patchLeaseSaga({payload: lease}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(patchLease, lease);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleLease(bodyAsJson));
        yield put(hideEditMode());
        displayUIMessage({title: 'Vuokraus tallennettu', body: 'Vuokraus on tallennettu onnistuneesti'});
        break;
      case 400:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({_error: 'Server error 400', ...bodyAsJson})));
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

function* fetchCommentsSaga({payload: id}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield yield call(fetchComments, id);
    const comments = bodyAsJson.results;

    switch (statusCode) {
      case 200:
        yield put(receiveComments(comments));
        break;
      case 404:
      case 500:
        break;
    }
  } catch (error) {
    console.error('Failed to fetch comments with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* fetchCommentAttributesSaga(): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchCommentAttributes);
    const attributes = bodyAsJson.fields;

    switch (statusCode) {
      case 200:
        yield put(receiveCommentAttributes(attributes));
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

function* createCommentSaga({payload: comment}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(createComment, comment);

    switch (statusCode) {
      case 201:
        yield put(receiveCreatedComment(bodyAsJson));
        displayUIMessage({title: 'Kommentti tallennettu', body: 'Kommentti on tallennettu onnistuneesti'});
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
    console.error('Failed to create lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* editCommentSaga({payload: comment}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(editComment, comment);

    switch (statusCode) {
      case 200:
        yield put(receiveEditedComment(bodyAsJson));
        displayUIMessage({title: 'Kommentti tallennettu', body: 'Kommentti on tallennettu onnistuneesti'});
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
    console.error('Failed to edit lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* createContactSaga({payload: contact}): Generator<> {
  try {
    const contactModalSettings = yield select(getContactModalSettings);
    const {response: {status: statusCode}, bodyAsJson} = yield call(createContact, contact);

    switch (statusCode) {
      case 201:
        yield put(receiveNewContactToCompleteList(bodyAsJson));
        contactModalSettings.contactId = bodyAsJson.id;
        yield put(receiveContactModalSettings(contactModalSettings));
        yield put(hideContactModal());
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
        yield put(receiveEditedContactToCompleteList(bodyAsJson));
        yield put(hideContactModal());
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

export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/leases/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/leases/FETCH_LESSORS', fetchLessorsSaga);
      yield takeLatest('mvj/leases/FETCH_DECISIONS', fetchDecisionsSaga);
      yield takeLatest('mvj/leases/FETCH_ALL', fetchLeasesSaga);
      yield takeLatest('mvj/leases/FETCH_SINGLE', fetchSingleLeaseSaga);
      yield takeLatest('mvj/leases/CREATE', createLeaseSaga);
      yield takeLatest('mvj/leases/PATCH', patchLeaseSaga);
      yield takeLatest('mvj/leases/FETCH_COMMENTS', fetchCommentsSaga);
      yield takeLatest('mvj/leases/FETCH_COMMENT_ATTRIBUTES', fetchCommentAttributesSaga);
      yield takeLatest('mvj/leases/CREATE_COMMENT', createCommentSaga);
      yield takeLatest('mvj/leases/EDIT_COMMENT', editCommentSaga);
      yield takeLatest('mvj/leases/CREATE_CONTACT', createContactSaga);
      yield takeLatest('mvj/leases/EDIT_CONTACT', editContactSaga);
    }),
  ];
}
