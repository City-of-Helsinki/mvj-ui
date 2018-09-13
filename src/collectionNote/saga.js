// @flow
import {all, call, fork, put, select, takeLatest} from 'redux-saga/effects';
import {SubmissionError} from 'redux-form';

import {receiveError} from '$src/api/actions';
import {
  fetchCollectionNotesByLease as fetchCollectionNotesByLeaseAction,
  receiveCollectionNotesByLease,
  notFoundByLease,
} from './actions';
import {displayUIMessage} from '$util/helpers';
import {
  fetchCollectionNotesByLease,
  createCollectionNote,
  deleteCollectionNote,
} from './requests';
import {getCollectionNotesByLease} from './selectors';

function* fetchCollectionNotesByLeaseSaga({payload: lease}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchCollectionNotesByLease, lease);

    switch (statusCode) {
      case 200:
        yield put(receiveCollectionNotesByLease({lease: lease, collectionNotes: bodyAsJson.results}));
        break;
      default:
        yield put(notFoundByLease(lease));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch collection notes by lease with error "%s"', error);
    yield put(receiveError(error));
    yield put(notFoundByLease(lease));
  }
}

function* createCollectionNoteSaga({payload}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(createCollectionNote, payload);

    switch (statusCode) {
      case 201:
        yield put(fetchCollectionNotesByLeaseAction(payload.lease));
        displayUIMessage({title: '', body: 'Huomautus tallennettu'});
        break;
      default:
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
    }
  } catch (error) {
    console.error('Failed to create collection note with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* deleteCollectionNoteSaga({payload}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(deleteCollectionNote, payload.id);

    switch (statusCode) {
      case 204:
        const currentNotes = yield select(getCollectionNotesByLease, payload.lease);
        yield put(receiveCollectionNotesByLease({
          lease: payload.lease,
          collectionNotes: currentNotes.filter((note) => note.id !== payload.id)}
        ));
        displayUIMessage({title: '', body: 'Huomautus poistettu'});
        break;
      default:
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
    }
  } catch (error) {
    console.error('Failed to delete collection note with error "%s"', error);
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/collectionNote/FETCH_BY_LEASE', fetchCollectionNotesByLeaseSaga);
      yield takeLatest('mvj/collectionNote/CREATE', createCollectionNoteSaga);
      yield takeLatest('mvj/collectionNote/DELETE', deleteCollectionNoteSaga);
    }),
  ]);
}
