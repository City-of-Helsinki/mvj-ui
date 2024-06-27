import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { SubmissionError } from "redux-form";
import { fetchInvoicesByLease, receiveAttributes, receiveMethods, attributesNotFound, receiveInvoicesByLease, receiveInvoiceToCredit, receiveIsCreateInvoicePanelOpen, receiveIsCreditInvoicePanelOpen, receiveIsEditClicked, receivePatchedInvoice, notFound } from "./actions";
import { receiveError } from "/src/api/actions";
import { displayUIMessage } from "/src/util/helpers";
import { exportInvoiceToLaske, fetchAttributes, fetchInvoices, createInvoice, creditInvoice, patchInvoice, deleteInvoice } from "./requests";

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
    console.error('Failed to fetch invoice attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchInvoicesByLeaseSaga({
  payload: leaseId,
  type: any
}): Generator<any, any, any> {
  try {
    let {
      response: {
        status: statusCode
      },
      bodyAsJson: body
    } = yield call(fetchInvoices, {
      lease: leaseId,
      limit: 10000
    });
    let invoices = body.results;

    while (statusCode === 200 && body.next) {
      const {
        response: {
          status
        },
        bodyAsJson
      // @ts-ignore: No overload matches this call
      } = yield call(fetchInvoices, `?${body.next.split('?').pop()}`);
      statusCode = status;
      body = bodyAsJson;
      invoices = [...invoices, ...body.results];
    }

    switch (statusCode) {
      case 200:
        yield put(receiveInvoicesByLease({
          leaseId: leaseId,
          invoices: invoices
        }));
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

function* createInvoiceSaga({
  payload: invoice,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(createInvoice, invoice);

    switch (statusCode) {
      case 201:
        yield put(fetchInvoicesByLease(invoice.lease));
        yield put(receiveIsCreateInvoicePanelOpen(false));
        displayUIMessage({
          title: '',
          body: 'Lasku luotu'
        });
        break;

      case 400:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({ ...bodyAsJson
        })));
        break;

      case 500:
        yield put(notFound());
        yield put(receiveError(bodyAsJson));
        break;
    }
  } catch (error) {
    console.error('Failed to create invoice with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* creditInvoiceSaga({
  payload: {
    creditData,
    invoiceId,
    lease
  },
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(creditInvoice, {
      creditData: creditData,
      invoiceId: invoiceId
    });

    switch (statusCode) {
      case 200:
        yield put(fetchInvoicesByLease(lease));
        yield put(receiveIsCreditInvoicePanelOpen(false));
        yield put(receiveInvoiceToCredit(null));
        displayUIMessage({
          title: '',
          body: 'Hyvityslasku luotu'
        });
        break;

      default:
        yield put(receiveError(new SubmissionError({ ...bodyAsJson
        })));
        break;
    }
  } catch (error) {
    console.error('Failed to create invoice with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* patchInvoiceSaga({
  payload: invoice,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(patchInvoice, invoice);

    switch (statusCode) {
      case 200:
        yield put(fetchInvoicesByLease(bodyAsJson.lease));
        yield put(receivePatchedInvoice(bodyAsJson));
        yield put(receiveIsEditClicked(false));
        displayUIMessage({
          title: '',
          body: 'Lasku tallennettu'
        });
        break;

      case 400:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({
          _error: 'Server error 400',
          ...bodyAsJson
        })));
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

function* exportInvoiceToLaskeAndUpdateListSaga({
  payload: {
    id,
    lease
  },
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(exportInvoiceToLaske, id);

    if (statusCode === 200 && bodyAsJson.success) {
      yield put(fetchInvoicesByLease(lease));
      displayUIMessage({
        title: '',
        body: 'Lasku lähetetty SAP:iin'
      });
    } else {
      yield put(notFound());
      yield put(receiveError(new SubmissionError({ ...bodyAsJson
      })));
    }
  } catch (error) {
    console.error('Failed to export invoice to laske with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* deleteInvoiceSaga({
  payload: invoice,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(deleteInvoice, invoice.id);

    if (statusCode === 204) {
      yield put(fetchInvoicesByLease(invoice.lease));
      displayUIMessage({
        title: '',
        body: 'Lasku poistettu'
      });
    } else {
      yield put(notFound());
      yield put(receiveError(new SubmissionError({ ...bodyAsJson
      })));
    }
  } catch (error) {
    console.error('Failed to delete invoice "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/invoices/FETCH_ATTRIBUTES', fetchAttributesSaga);
    yield takeLatest('mvj/invoices/FETCH_BY_LEASE', fetchInvoicesByLeaseSaga);
    yield takeLatest('mvj/invoices/CREATE', createInvoiceSaga);
    yield takeLatest('mvj/invoices/CREDIT_INVOICE', creditInvoiceSaga);
    yield takeLatest('mvj/invoices/PATCH', patchInvoiceSaga);
    yield takeLatest('mvj/invoices/EXPORT_TO_LASKE_AND_UPDATE', exportInvoiceToLaskeAndUpdateListSaga);
    yield takeLatest('mvj/invoices/DELETE', deleteInvoiceSaga);
  })]);
}