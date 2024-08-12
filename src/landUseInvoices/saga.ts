import { all, call, fork, put, select, takeLatest } from "redux-saga/effects";
import { SubmissionError } from "redux-form";
import { receiveSingleLandUseContract } from "landUseContract/actions";
import { fetchInvoicesByLandUseContract, receiveAttributes, receiveMethods, attributesNotFound, receiveInvoicesByLandUseContract, receiveIsCreateInvoicePanelOpen, receiveIsEditClicked, receivePatchedInvoice, notFound, receiveIsCreditInvoicePanelOpen, receiveInvoiceToCredit } from "./actions";
import { receiveError } from "api/actions";
import { displayUIMessage } from "util/helpers";
import { fetchAttributes, createInvoice, patchInvoice, deleteInvoice, fetchInvoices, exportInvoiceToLaske, creditInvoice } from "./requests";
import { getCurrentLandUseContract } from "landUseContract/selectors";

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
    console.error('Failed to fetch land use invoice attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchInvoicesByLandUseContractSaga({
  payload: search,
  type: any
}): Generator<any, any, any> {
  try {
    let {
      response: {
        status: statusCode
      },
      bodyAsJson: body
    } = yield call(fetchInvoices, {
      land_use_agreement: search
    });
    let invoices = body.results;

    while (statusCode === 200 && body.next) {
      const {
        response: {
          status
        },
        bodyAsJson
      } = yield call(fetchInvoices, `?${body.next.split('?').pop()}`);
      statusCode = status;
      body = bodyAsJson;
      invoices = [...invoices, ...body.results];
    }

    switch (statusCode) {
      case 200:
        yield put(receiveInvoicesByLandUseContract({
          id: search,
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
        yield put(fetchInvoicesByLandUseContract(invoice.land_use_agreement));
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
        // yield put(fetchInvoicesByLandUseContract(bodyAsJson.lease));
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
      yield put(fetchInvoicesByLandUseContract(invoice.land_use_agreement));
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
    console.error('Failed to delete land use invoice "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* startInvoicingSaga({
  payload: Id,
  type: any
}): Generator<any, any, any> {
  console.log(Id);
  const currentLandUseContract = yield select(getCurrentLandUseContract);
  yield put(receiveSingleLandUseContract({ ...currentLandUseContract,
    is_invoicing_enabled: true
  }));
  displayUIMessage({
    title: '',
    body: 'Laskutus käynnistetty'
  });
}

function* stopInvoicingSaga({
  payload: Id,
  type: any
}): Generator<any, any, any> {
  console.log(Id);
  const currentLandUseContract = yield select(getCurrentLandUseContract);
  yield put(receiveSingleLandUseContract({ ...currentLandUseContract,
    is_invoicing_enabled: false
  }));
  displayUIMessage({
    title: '',
    body: 'Laskutus keskeytetty'
  });
}

function* exportInvoiceToLaskeAndUpdateListSaga({
  payload: {
    id,
    landUseContract
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
      yield put(fetchInvoicesByLandUseContract(landUseContract));
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

function* creditInvoiceSaga({
  payload: {
    creditData,
    invoiceId,
    landUseContract
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
        yield put(fetchInvoicesByLandUseContract(landUseContract));
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

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/landUseInvoices/FETCH_ATTRIBUTES', fetchAttributesSaga);
    yield takeLatest('mvj/landUseInvoices/FETCH_BY_LAND_USE_CONTRACT', fetchInvoicesByLandUseContractSaga);
    yield takeLatest('mvj/landUseInvoices/CREATE', createInvoiceSaga);
    yield takeLatest('mvj/landUseInvoices/PATCH', patchInvoiceSaga);
    yield takeLatest('mvj/landUseInvoices/DELETE', deleteInvoiceSaga);
    yield takeLatest('mvj/landUseInvoices/START_INVOICING', startInvoicingSaga);
    yield takeLatest('mvj/landUseInvoices/STOP_INVOICING', stopInvoicingSaga);
    yield takeLatest('mvj/landUseInvoices/EXPORT_TO_LASKE_AND_UPDATE', exportInvoiceToLaskeAndUpdateListSaga);
    yield takeLatest('mvj/landUseInvoices/CREDIT_INVOICE', creditInvoiceSaga);
  })]);
}