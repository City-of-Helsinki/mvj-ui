// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';
import {SubmissionError} from 'redux-form';

import {receiveError} from '$src/api/actions';
import {
  fetchCollectionLettersByLease as fetchCollectionLettersByLeaseAction,
  receiveCollectionLettersByLease,
  notFoundByLease,
} from './actions';
import {displayUIMessage} from '../util/helpers';
import {
  fetchCollectionLettersByLease,
  uploadCollectionLetterFile,
  deleteCollectionLetterFile,
} from './requests';

function* fetchCollectionLettersByLeaseSaga({payload: lease}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchCollectionLettersByLease, lease);

    switch (statusCode) {
      case 200:
        yield put(receiveCollectionLettersByLease({lease: lease, collectionLetters: bodyAsJson.results}));
        break;
      default:
        yield put(notFoundByLease(lease));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch collection letters by lease with error "%s"', error);
    yield put(notFoundByLease(lease));
  }
}

function* uploadCollectionLetterFileSaga({payload}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(uploadCollectionLetterFile, payload);

    switch (statusCode) {
      case 201:
        displayUIMessage({title: '', body: 'Perintäkirje tallennettu'});
        yield put(fetchCollectionLettersByLeaseAction(payload.data.lease));
        break;
      default:
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
    }
  } catch (error) {
    console.error('Failed to upload a file with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* deleteCollectionLetterFileSaga({payload}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(deleteCollectionLetterFile, payload.id);

    switch (statusCode) {
      case 204:
        displayUIMessage({title: '', body: 'Perintäkirje poistettu'});
        yield put(fetchCollectionLettersByLeaseAction(payload.lease));
        break;
      default:
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
    }
  } catch (error) {
    console.error('Failed to upload a file with error "%s"', error);
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/collectionLetter/FETCH_BY_LEASE', fetchCollectionLettersByLeaseSaga);
      yield takeLatest('mvj/collectionLetter/UPLOAD_FILE', uploadCollectionLetterFileSaga);
      yield takeLatest('mvj/collectionLetter/DELETE_FILE', deleteCollectionLetterFileSaga);
    }),
  ]);
}
