import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { SubmissionError } from "redux-form";
import { receiveError } from "@/api/actions";
import { attributesNotFound, fetchInvoiceNoteList, hideCreateInvoiceNoteModal, notFound, receiveAttributes, receiveInvoiceNoteList, receiveMethods } from "./actions";
import { displayUIMessage } from "@/util/helpers";
import { createInvoiceNote, fetchAttributes, fetchInvoiceNotes } from "./requests";

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
        const attributes = bodyAsJson.fields || null;
        const methods = bodyAsJson.methods || null;
        yield put(receiveAttributes(attributes));
        yield put(receiveMethods(methods));
        break;

      default:
        yield put(attributesNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch invoice note attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchInvoiceNotesSaga({
  payload: query,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchInvoiceNotes, query);

    switch (statusCode) {
      case 200:
        yield put(receiveInvoiceNoteList(bodyAsJson));
        break;

      default:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch invoice notes with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* createInvoiceNoteAndFetchListSaga({
  payload: {
    data,
    query
  },
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(createInvoiceNote, data);

    switch (statusCode) {
      case 201:
        yield put(hideCreateInvoiceNoteModal());
        displayUIMessage({
          title: '',
          body: 'Laskujen tiedote tallennettu'
        });
        yield put(fetchInvoiceNoteList(query));
        break;

      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;

      default:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({ ...bodyAsJson
        })));
        break;
    }
  } catch (error) {
    console.error('Failed to create invoice note with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/invoiceNote/FETCH_ATTRIBUTES', fetchAttributesSaga);
    yield takeLatest('mvj/invoiceNote/FETCH_ALL', fetchInvoiceNotesSaga);
    yield takeLatest('mvj/invoiceNote/CREATE_AND_FETCH', createInvoiceNoteAndFetchListSaga);
  })]);
}