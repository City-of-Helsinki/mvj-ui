// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';
import {SubmissionError} from 'redux-form';

import {receiveError} from '$src/api/actions';
import {
  hideEditMode,
  notFound,
  receiveAreaNoteList,
  receiveDeletedAreaNote,
  receiveEditedAreaNote,
} from './actions';
import {displayUIMessage} from '$util/helpers';
import {
  createAreaNote,
  deleteAreaNote,
  editAreaNote,
  fetchAreaNotes,
} from './requests';

function* fetchAreaNoteListSaga({payload: search}): Generator<any, any, any> {
  try {
    let {response: {status: statusCode}, bodyAsJson: body} = yield call(fetchAreaNotes, search);
    let areaNotes = body.results;
    while(statusCode === 200 && body.next) {
      const {response: {status}, bodyAsJson} = yield call(fetchAreaNotes, `?${body.next.split('?').pop()}`);
      statusCode = status;
      body = bodyAsJson;
      areaNotes = [...areaNotes, ...body.results];
    }
    switch (statusCode) {
      case 200:
        yield put(receiveAreaNoteList(areaNotes));
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

function* createAreaNoteSaga({payload}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(createAreaNote, payload);

    switch (statusCode) {
      case 201:
        yield put(receiveEditedAreaNote(bodyAsJson));
        yield put(hideEditMode());
        displayUIMessage({title: '', body: 'Muistettava ehto luotu'});
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
    console.error('Failed to create area note with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* deleteAreaNoteSaga({payload: id}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(deleteAreaNote, id);

    switch (statusCode) {
      case 204:
        yield put(receiveDeletedAreaNote(id));
        yield put(hideEditMode());
        displayUIMessage({title: '', body: 'Muistettava ehto poistettu'});
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
    console.error('Failed to delete area note with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* editAreaNoteSaga({payload}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(editAreaNote, payload);

    switch (statusCode) {
      case 200:
        yield put(receiveEditedAreaNote(bodyAsJson));
        yield put(hideEditMode());
        displayUIMessage({title: '', body: 'Muistettava ehto tallennettu'});
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
    console.error('Failed to edit area note with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/areaNote/FETCH_ALL', fetchAreaNoteListSaga);
      yield takeLatest('mvj/areaNote/CREATE', createAreaNoteSaga);
      yield takeLatest('mvj/areaNote/DELETE', deleteAreaNoteSaga);
      yield takeLatest('mvj/areaNote/EDIT', editAreaNoteSaga);
    }),
  ]);
}
