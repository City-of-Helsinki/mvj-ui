import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { SubmissionError } from "redux-form";
import { fetchSingleLeaseAfterEdit } from "leases/actions";
import { receiveError } from "/src/api/actions";
import { displayUIMessage } from "util/helpers";
import { createLeaseAreaAttachment, deleteLeaseAreaAttachment } from "./requests";

function* createLeaseAreaAttachmentSaga({
  payload,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(createLeaseAreaAttachment, payload);

    switch (statusCode) {
      case 201:
        yield put(fetchSingleLeaseAfterEdit({
          leaseId: payload.lease,
          callbackFunctions: [() => displayUIMessage({
            title: '',
            body: 'Tiedosto lisätty'
          })]
        }));
        break;

      case 404:
        yield put(receiveError(new SubmissionError({ ...bodyAsJson
        })));
        break;
    }
  } catch (error) {
    console.error('Failed to create an attachment with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* deleteLeaseAreaAttachmentSaga({
  payload,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(deleteLeaseAreaAttachment, payload.id);

    switch (statusCode) {
      case 204:
        yield put(fetchSingleLeaseAfterEdit({
          leaseId: payload.lease,
          callbackFunctions: [() => displayUIMessage({
            title: '',
            body: 'Tiedosto poistettu'
          })]
        }));
        break;

      case 404:
        yield put(receiveError(new SubmissionError({ ...bodyAsJson
        })));
        break;
    }
  } catch (error) {
    console.error('Failed to delete an attachment with error "%s"', error);
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/leaseAreaAttachment/CREATE', createLeaseAreaAttachmentSaga);
    yield takeLatest('mvj/leaseAreaAttachment/DELETE', deleteLeaseAreaAttachmentSaga);
  })]);
}