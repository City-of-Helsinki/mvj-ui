// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';
import {SubmissionError} from 'redux-form';

import {receiveError} from '$src/api/actions';
import {fetchSingleLeaseAfterEdit} from '$src/leases/actions';
import {displayUIMessage} from '$src/util/helpers';
import {
  createRelatedLease,
  deleteReleatedLease,
} from './requests';

function* createReleatedLeaseSaga({payload}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson: bodyDelete} = yield call(createRelatedLease, payload);

    switch (statusCode) {
      case 201:
        yield put(fetchSingleLeaseAfterEdit({
          leaseId: payload.from_lease,
          callbackFunctions: [
            () => displayUIMessage({title: '', body: 'Vuokratunnusten välinen liitos luotu'}),
          ],
        }));
        break;
      default:
        yield put(receiveError(new SubmissionError({...bodyDelete})));
        break;
    }
  } catch (error) {
    console.error('Failed to create related lease with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* deleteReleatedLeaseSaga({payload}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson: bodyDelete} = yield call(deleteReleatedLease, payload.id);

    switch (statusCode) {
      case 204:
        yield put(fetchSingleLeaseAfterEdit({
          leaseId: payload.leaseId,
          callbackFunctions: [
            () => displayUIMessage({title: '', body: 'Vuokratunnusten välinen liitos poistettu'}),
          ],
        }));
        break;
      default:
        yield put(receiveError(new SubmissionError({...bodyDelete})));
        break;
    }
  } catch (error) {
    console.error('Failed to delete related lease with error "%s"', error);
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/relatedLease/CREATE', createReleatedLeaseSaga);
      yield takeLatest('mvj/relatedLease/DELETE', deleteReleatedLeaseSaga);
    }),
  ]);
}
