import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { SubmissionError } from "redux-form";
import { fetchSingleLeaseAfterEdit } from "@/leases/actions";
import { receiveError } from "@/api/actions";
import {
  createLeaseInspectionAttachment,
  deleteLeaseInspectionAttachment,
} from "./requests";
import type {
  DeleteLeaseInspectionAttachmentPayload,
  CreateLeaseInspectionAttachmentPayload,
} from "./types";

function* createLeaseInspectionAttachmentSaga({
  payload,
}: {
  payload: CreateLeaseInspectionAttachmentPayload;
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(createLeaseInspectionAttachment, payload);

    switch (statusCode) {
      case 201:
        yield put(
          fetchSingleLeaseAfterEdit({
            leaseId: payload.lease,
            successMessage: "Tiedosto lisätty",
          }),
        );
        break;

      case 404:
        yield put(receiveError(new SubmissionError({ ...bodyAsJson })));
        break;
    }
  } catch (error) {
    console.error('Failed to create an attachment with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* deleteLeaseInspectionAttachmentSaga({
  payload,
}: {
  payload: DeleteLeaseInspectionAttachmentPayload;
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(deleteLeaseInspectionAttachment, payload.id);

    switch (statusCode) {
      case 204:
        yield put(
          fetchSingleLeaseAfterEdit({
            leaseId: payload.lease,
            successMessage: "Tiedosto poistettu",
          }),
        );
        break;

      case 404:
        yield put(receiveError(new SubmissionError({ ...bodyAsJson })));
        break;
    }
  } catch (error) {
    console.error('Failed to delete an attachment with error "%s"', error);
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([
    fork(function* (): Generator<any, any, any> {
      yield takeLatest(
        "mvj/leaseInspectionAttachment/CREATE",
        createLeaseInspectionAttachmentSaga,
      );
      yield takeLatest(
        "mvj/leaseInspectionAttachment/DELETE",
        deleteLeaseInspectionAttachmentSaga,
      );
    }),
  ]);
}
