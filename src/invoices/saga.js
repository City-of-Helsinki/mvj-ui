// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';
import {SubmissionError} from 'redux-form';

import {getSearchQuery} from '$util/helpers';
import {
  fetchInvoices as fetchInvoicesAction,
  receiveAttributes,
  receiveInvoices,
  receiveIsCreateOpen,
  receivePatchedInvoice,
  notFound,
} from './actions';
import {
  fetchAttributes,
  fetchInvoices,
  createInvoice,
  patchInvoice,
} from './requests';
import {receiveError} from '$src/api/actions';

function* fetchAttributesSaga(): Generator<any, any, any> {
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
    console.error('Failed to fetch invoice attributes with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* fetchInvoicesSaga({payload: search}): Generator<any, any, any> {
  try {
    let {response: {status: statusCode}, bodyAsJson: body} = yield call(fetchInvoices, search);
    let invoices = body.results;
    while(statusCode === 200 && body.next) {
      const {response: {status}, bodyAsJson} = yield call(fetchInvoices, `?${body.next.split('?').pop()}`);
      statusCode = status;
      body = bodyAsJson;
      invoices = [...invoices, ...body.results];
    }

    switch (statusCode) {
      case 200:
        yield put(receiveInvoices(invoices));
        break;
      case 404:
      case 500:
        break;
    }
  } catch (error) {
    console.error('Failed to fetch invoices with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* createInvoiceSaga({payload: invoice}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(createInvoice, invoice);

    switch (statusCode) {
      case 201:
        yield put(fetchInvoicesAction(getSearchQuery({lease: invoice.lease})));
        yield put(receiveIsCreateOpen(false));
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
    console.error('Failed to create invoice with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* patchInvoiceSaga({payload: invoice}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(patchInvoice, invoice);

    switch (statusCode) {
      case 200:
        yield put(fetchInvoicesAction(getSearchQuery({lease: bodyAsJson.lease})));
        yield put(receivePatchedInvoice(bodyAsJson));
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
    console.error('Failed to edit invoice with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/invoices/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/invoices/FETCH_ALL', fetchInvoicesSaga);
      yield takeLatest('mvj/invoices/CREATE', createInvoiceSaga);
      yield takeLatest('mvj/invoices/PATCH', patchInvoiceSaga);
    }),
  ]);
}
