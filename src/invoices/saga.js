// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';
import {SubmissionError} from 'redux-form';

import {getSearchQuery} from '$util/helpers';
import {
  fetchInvoicesByLease,
  receiveAttributes,
  receiveInvoicesByLease,
  receiveInvoiceToCredit,
  receiveIsCreateInvoicePanelOpen,
  receiveIsCreditInvoicePanelOpen,
  receiveIsEditClicked,
  receivePatchedInvoice,
  notFound,
} from './actions';
import {receiveError} from '$src/api/actions';
import {displayUIMessage} from '$util/helpers';
import {
  fetchAttributes,
  fetchInvoices,
  createInvoice,
  creditInvoice,
  patchInvoice,
} from './requests';

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

function* fetchInvoicesByLeaseSaga({payload: leaseId}): Generator<any, any, any> {
  try {
    let {response: {status: statusCode}, bodyAsJson: body} = yield call(fetchInvoices, getSearchQuery({lease: leaseId, limit: 10000}));
    let invoices = body.results;
    while(statusCode === 200 && body.next) {
      const {response: {status}, bodyAsJson} = yield call(fetchInvoices, `?${body.next.split('?').pop()}`);
      statusCode = status;
      body = bodyAsJson;
      invoices = [...invoices, ...body.results];
    }

    switch (statusCode) {
      case 200:
        yield put(receiveInvoicesByLease({leaseId: leaseId, invoices: invoices}));
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
        yield put(fetchInvoicesByLease(invoice.lease));
        yield put(receiveIsCreateInvoicePanelOpen(false));
        displayUIMessage({title: '', body: 'Lasku luotu'});
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

function* creditInvoiceSaga({payload: {creditData, invoiceId, lease}}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(creditInvoice, {creditData: creditData, invoiceId: invoiceId});

    switch (statusCode) {
      case 200:
        yield put(fetchInvoicesByLease(lease));
        yield put(receiveIsCreditInvoicePanelOpen(false));
        yield put(receiveInvoiceToCredit(null));
        displayUIMessage({title: '', body: 'Hyvityslasku luotu'});
        break;
      case 400:
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
      case 500:
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
    }
  } catch (error) {
    console.error('Failed to create invoice with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* patchInvoiceSaga({payload: invoice}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(patchInvoice, invoice);

    switch (statusCode) {
      case 200:
        yield put(fetchInvoicesByLease(bodyAsJson.lease));
        yield put(receivePatchedInvoice(bodyAsJson));
        yield put(receiveIsEditClicked(false));
        displayUIMessage({title: '', body: 'Lasku tallennettu'});
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
      yield takeLatest('mvj/invoices/FETCH_BY_LEASE', fetchInvoicesByLeaseSaga);
      yield takeLatest('mvj/invoices/CREATE', createInvoiceSaga);
      yield takeLatest('mvj/invoices/CREDIT_INVOICE', creditInvoiceSaga);
      yield takeLatest('mvj/invoices/PATCH', patchInvoiceSaga);
    }),
  ]);
}
