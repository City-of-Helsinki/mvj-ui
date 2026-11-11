import { all, call, fork, put, select, takeLatest } from "redux-saga/effects";
import { SubmissionError } from "redux-form";
import { receiveError } from "@/api/slice";
import { fetchSingleLeaseAfterEdit } from "@/leases/slice";
import {
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  fetchCollectionNotesByLease as fetchCollectionNotesByLeaseAction,
  receiveCollectionNotesByLease,
  notFoundByLease,
  fetchAttributes as fetchAttributesAction,
  createCollectionNote as createCollectionNoteAction,
  deleteCollectionNote as deleteCollectionNoteAction,
  editCollectionNote as editCollectionNoteAction,
} from "./slice";
import { displayUIMessage } from "@/util/helpers";
import {
  fetchAttributes,
  fetchCollectionNotesByLease,
  createCollectionNote,
  deleteCollectionNote,
  patchCollectionNote,
} from "./requests";
import { getCollectionNotesByLease } from "./selectors";
import { fetchInvoicesByLease } from "@/invoices/slice";

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchAttributes);

    switch (statusCode) {
      case 200: {
        const attributes = bodyAsJson.fields;
        const methods = bodyAsJson.methods;
        yield put(receiveAttributes(attributes));
        yield put(receiveMethods(methods));
        break;
      }

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

function* fetchCollectionNotesByLeaseSaga({
  payload: lease,
}: ReturnType<typeof fetchCollectionNotesByLeaseAction>): Generator<
  any,
  any,
  any
> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchCollectionNotesByLease, lease);

    switch (statusCode) {
      case 200:
        yield put(
          receiveCollectionNotesByLease({
            lease: lease,
            collectionNotes: bodyAsJson.results,
          }),
        );
        break;

      default:
        yield put(notFoundByLease(lease));
        break;
    }
  } catch (error) {
    console.error(
      'Failed to fetch collection notes by lease with error "%s"',
      error,
    );
    yield put(receiveError(error));
    yield put(notFoundByLease(lease));
  }
}

function* createCollectionNoteSaga({
  payload,
}: ReturnType<typeof createCollectionNoteAction>): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(createCollectionNote, payload);

    switch (statusCode) {
      case 201:
        yield put(fetchCollectionNotesByLeaseAction(payload.lease));
        yield put(fetchInvoicesByLease(payload.lease));
        yield put(
          fetchSingleLeaseAfterEdit({
            leaseId: payload.lease,
            successMessage: "Huomautus tallennettu",
          }),
        );
        break;

      default:
        yield put(receiveError(new SubmissionError({ ...bodyAsJson })));
        break;
    }
  } catch (error) {
    console.error('Failed to create collection note with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* deleteCollectionNoteSaga({
  payload,
}: ReturnType<typeof deleteCollectionNoteAction>): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(deleteCollectionNote, payload.id);

    switch (statusCode) {
      case 204: {
        const currentNotes = yield select(
          getCollectionNotesByLease,
          payload.lease,
        );
        yield put(
          receiveCollectionNotesByLease({
            lease: payload.lease,
            collectionNotes: currentNotes.filter(
              (note) => note.id !== payload.id,
            ),
          }),
        );
        displayUIMessage({
          title: "",
          body: "Huomautus poistettu",
        });
        break;
      }

      default:
        yield put(receiveError(new SubmissionError({ ...bodyAsJson })));
        break;
    }
  } catch (error) {
    console.error('Failed to delete collection note with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* editCollectionNoteSaga({
  payload,
}: ReturnType<typeof editCollectionNoteAction>): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(patchCollectionNote, payload);

    switch (statusCode) {
      case 200:
        yield put(fetchCollectionNotesByLeaseAction(payload.lease));
        displayUIMessage({
          title: "",
          body: "Huomautus tallennettu",
        });
        break;

      default:
        yield put(receiveError(new SubmissionError({ ...bodyAsJson })));
        break;
    }
  } catch (error) {
    console.error('Failed to edit collection note with error "%s"', error);
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([
    fork(function* (): Generator<any, any, any> {
      yield takeLatest(fetchAttributesAction, fetchAttributesSaga);
      yield takeLatest(
        fetchCollectionNotesByLeaseAction,
        fetchCollectionNotesByLeaseSaga,
      );
      yield takeLatest(createCollectionNoteAction, createCollectionNoteSaga);
      yield takeLatest(deleteCollectionNoteAction, deleteCollectionNoteSaga);
      yield takeLatest(editCollectionNoteAction, editCollectionNoteSaga);
    }),
  ]);
}
