import { all, call, fork, put, select, takeLatest } from "redux-saga/effects";
import { SubmissionError } from "redux-form";
import { receiveError } from "src/api/actions";
import { attributesNotFound, receiveAttributes, receiveMethods, fetchCollectionLettersByLease as fetchCollectionLettersByLeaseAction, receiveCollectionLettersByLease, notFoundByLease } from "./actions";
import { displayUIMessage } from "../util/helpers";
import { fetchAttributes, fetchCollectionLettersByLease, uploadCollectionLetter, deleteCollectionLetter } from "./requests";
import { getCollectionLettersByLease } from "./selectors";

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchAttributes);

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
    console.error('Failed to fetch attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchCollectionLettersByLeaseSaga({
  payload: lease
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchCollectionLettersByLease, lease);

    switch (statusCode) {
      case 200:
        yield put(receiveCollectionLettersByLease({
          lease: lease,
          collectionLetters: bodyAsJson.results
        }));
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

function* uploadCollectionLetterSaga({
  payload
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(uploadCollectionLetter, payload);

    switch (statusCode) {
      case 201:
        yield put(fetchCollectionLettersByLeaseAction(payload.data.lease));
        displayUIMessage({
          title: '',
          body: 'Perintäkirje tallennettu'
        });
        break;

      default:
        yield put(receiveError(new SubmissionError({ ...bodyAsJson
        })));
        break;
    }
  } catch (error) {
    console.error('Failed to upload collection letter with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* deleteCollectionLetterSaga({
  payload
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(deleteCollectionLetter, payload.id);

    switch (statusCode) {
      case 204:
        const currentLetters = yield select(getCollectionLettersByLease, payload.lease);
        yield put(receiveCollectionLettersByLease({
          lease: payload.lease,
          collectionLetters: currentLetters.filter(letter => letter.id !== payload.id)
        }));
        displayUIMessage({
          title: '',
          body: 'Perintäkirje poistettu'
        });
        break;

      default:
        yield put(receiveError(new SubmissionError({ ...bodyAsJson
        })));
        break;
    }
  } catch (error) {
    console.error('Failed to delete collection letter with error "%s"', error);
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/collectionLetter/FETCH_ATTRIBUTES', fetchAttributesSaga);
    yield takeLatest('mvj/collectionLetter/FETCH_BY_LEASE', fetchCollectionLettersByLeaseSaga);
    yield takeLatest('mvj/collectionLetter/UPLOAD', uploadCollectionLetterSaga);
    yield takeLatest('mvj/collectionLetter/DELETE', deleteCollectionLetterSaga);
  })]);
}