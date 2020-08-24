// @flow
import {all, call, fork, put, select, takeLatest} from 'redux-saga/effects';

import {SubmissionError} from 'redux-form';
import {
  receiveSingleLandUseContract,
} from '$src/landUseContract/actions';

import {
  fetchInvoicesByLandUseContract,
  receiveAttributes,
  // receiveMethods,
  // attributesNotFound,
  receiveInvoicesByLandUseContract,
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
  exportInvoiceToLaske,
  // fetchAttributes,
  // fetchInvoices,
  creditInvoice,
  patchInvoice,
  deleteInvoice,
} from './requests';
import {
  getCurrentLandUseContract,
} from '$src/landUseContract/selectors';

import attributesMockData from './dummyInvoiceAttributes.json';
import mockData from './dummyInvoiceSet.json';

function* fetchAttributesSaga(): Generator<any, any, any> {
  const attributes = attributesMockData.fields;
  yield put(receiveAttributes(attributes));
}

function* fetchInvoicesByLandUseContractSaga({payload: search}): Generator<any, any, any> {
  console.log('search');
  const invoices = mockData;

  yield put(receiveInvoicesByLandUseContract({leaseId: search, invoices: invoices}));
}

function* createInvoiceSaga({payload: invoice}): Generator<any, any, any> {
  const invoices = [invoice.landUseContractInvoice, ...invoice.invoices];
  yield put(receiveInvoicesByLandUseContract({leaseId: invoice.currentLandUseContractId, invoices: invoices}));
  yield put(receiveIsCreateInvoicePanelOpen(false));
  displayUIMessage({title: '', body: 'Lasku luotu'});
}

function* creditInvoiceSaga({payload: {creditData, invoiceId, lease}}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(creditInvoice, {creditData: creditData, invoiceId: invoiceId});

    switch (statusCode) {
      case 200:
        yield put(fetchInvoicesByLandUseContract(lease));
        yield put(receiveIsCreditInvoicePanelOpen(false));
        yield put(receiveInvoiceToCredit(null));
        displayUIMessage({title: '', body: 'Hyvityslasku luotu'});
        break;
      default:
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
        yield put(fetchInvoicesByLandUseContract(bodyAsJson.lease));
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

function* exportInvoiceToLaskeAndUpdateListSaga({payload: {id, lease}}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(exportInvoiceToLaske, id);

    if(statusCode === 200 && bodyAsJson.success) {
      yield put(fetchInvoicesByLandUseContract(lease));
      displayUIMessage({title: '', body: 'Lasku lähetetty SAP:iin'});
    } else {
      yield put(notFound());
      yield put(receiveError(new SubmissionError({...bodyAsJson})));
    }
  } catch (error) {
    console.error('Failed to export invoice to laske with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* deleteInvoiceSaga({payload: invoice}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(deleteInvoice, invoice.id);

    if(statusCode === 204) {
      yield put(fetchInvoicesByLandUseContract(invoice.lease));
      displayUIMessage({title: '', body: 'Lasku poistettu'});
    } else {
      yield put(notFound());
      yield put(receiveError(new SubmissionError({...bodyAsJson})));
    }
  } catch (error) {
    console.error('Failed to delete invoice "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* startInvoicingSaga({payload: Id}): Generator<any, any, any> {
  console.log(Id);
  const currentLandUseContract = yield select(getCurrentLandUseContract);
  yield put(receiveSingleLandUseContract({...currentLandUseContract, is_invoicing_enabled: true}));
  displayUIMessage({title: '', body: 'Laskutus käynnistetty'});
}

function* stopInvoicingSaga({payload: Id}): Generator<any, any, any> {
  console.log(Id);
  const currentLandUseContract = yield select(getCurrentLandUseContract);
  yield put(receiveSingleLandUseContract({...currentLandUseContract, is_invoicing_enabled: false}));
  displayUIMessage({title: '', body: 'Laskutus keskeytetty'});
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/landUseInvoices/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/landUseInvoices/FETCH_BY_LAND_USE_CONTRACT', fetchInvoicesByLandUseContractSaga);
      yield takeLatest('mvj/landUseInvoices/CREATE', createInvoiceSaga);
      yield takeLatest('mvj/landUseInvoices/CREDIT_INVOICE', creditInvoiceSaga);
      yield takeLatest('mvj/landUseInvoices/PATCH', patchInvoiceSaga);
      yield takeLatest('mvj/landUseInvoices/EXPORT_TO_LASKE_AND_UPDATE', exportInvoiceToLaskeAndUpdateListSaga);
      yield takeLatest('mvj/landUseInvoices/DELETE', deleteInvoiceSaga);
      yield takeLatest('mvj/landUseInvoices/START_INVOICING', startInvoicingSaga);
      yield takeLatest('mvj/landUseInvoices/STOP_INVOICING', stopInvoicingSaga);
    }),
  ]);
}
