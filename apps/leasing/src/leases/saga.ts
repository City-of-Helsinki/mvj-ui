import {
  all,
  call,
  fork,
  put,
  select,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import { SubmissionError } from "redux-form";
import { navigateTo } from "@/root/navigationService";
import { getRouteById, Routes } from "@/root/routes";
import {
  fetchSingleLeaseAfterEdit,
  hideAttachDecisionModal,
  hideCreateModal,
  hideEditMode,
  attributesNotFound,
  notFound,
  notFoundByBBox,
  notFoundById,
  receiveAttributes,
  receiveMethods,
  receiveIsCreateClicked as receiveIsCreateLeaseClicked,
  receiveIsSaveClicked,
  receiveLeases,
  receiveLeasesByBBox,
  receiveSingleLease,
  receiveLeaseById,
  receiveLeasesForContractNumbers,
  receiveLeasesForContact,
  receiveLeasesForContactAttributes,
  leasesForContactAttributesNotFound,
  fetchAttributes as fetchAttributesAction,
  fetchLeases as fetchLeasesAction,
  fetchLeasesByBBox as fetchLeasesByBBoxAction,
  fetchSingleLease as fetchSingleLeaseAction,
  fetchLeaseById as fetchLeaseByIdAction,
  createLease as createLeaseAction,
  deleteLease as deleteLeaseAction,
  patchLease as patchLeaseAction,
  patchLeaseInvoiceNotes as patchLeaseInvoiceNotesAction,
  sendEmail as sendEmailAction,
  startInvoicing as startInvoicingAction,
  stopInvoicing as stopInvoicingAction,
  setRentInfoComplete as setRentInfoCompleteAction,
  setRentInfoUncomplete as setRentInfoUncompleteAction,
  createCharge as createChargeAction,
  copyDecisionToLeases as copyDecisionToLeasesAction,
  fetchLeasesForContractNumbers as fetchLeasesForContractNumbersAction,
  fetchLeasesForContact as fetchLeasesForContactAction,
  fetchLeasesForContactAttributes as fetchLeasesForContactAttributesAction,
} from "./slice";
import { receiveError } from "@/api/slice";
import {
  fetchInvoicesByLease,
  receiveIsCreateClicked,
  receiveIsCreateInvoicePanelOpen,
} from "@/invoices/slice";
import { fetchInvoiceSetsByLease } from "@/invoiceSets/slice";
import { displayUIMessage, getSearchQuery, getUrlParams } from "@/util/helpers";
import {
  copyDecisionToLeases,
  createCharge,
  createLease,
  deleteLease,
  fetchAttributes,
  fetchLeases,
  fetchLeasesForContact,
  fetchLeasesForContactAttributes,
  fetchSingleLease,
  patchLease,
  sendEmail,
  startInvoicing,
  stopInvoicing,
  setRentInfoComplete,
  setRentInfoUncomplete,
} from "./requests";
import { getCurrentLease } from "./selectors";
import type { SendEmailPayload } from "./types";
import { editSingleAreaSearchRequest } from "@/areaSearch/requests";
import { AreaSearchState } from "@/plotSearch/enums";

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

function* fetchLeasesSaga({ payload: query }): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchLeases, query);

    switch (statusCode) {
      case 200:
        yield put(receiveLeases(bodyAsJson));
        break;

      case 404:
      case 500:
        yield put(notFound());
        break;

      default:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch leases with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchLeasesByBBoxSaga({ payload: query }): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchLeases, query);

    switch (statusCode) {
      case 200:
        yield put(receiveLeasesByBBox(bodyAsJson));
        break;

      case 404:
      case 500:
        yield put(notFoundByBBox());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch leases with error "%s"', error);
    yield put(notFoundByBBox());
    yield put(receiveError(error));
  }
}

function* fetchSingleLeaseSaga({ payload: id }): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchSingleLease, id);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleLease(bodyAsJson));
        break;

      case 404:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({ ...bodyAsJson })));
        break;

      default:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch leases with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchSingleLeaseAfterEditSaga({ payload }): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchSingleLease, payload.leaseId);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleLease(bodyAsJson));
        if (payload.successMessage) {
          displayUIMessage({ title: "", body: payload.successMessage });
        }
        break;

      case 404:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({ ...bodyAsJson })));
        break;

      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch leases with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchLeaseByIdSaga({ payload: id }): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchSingleLease, id);

    switch (statusCode) {
      case 200:
        yield put(
          receiveLeaseById({
            leaseId: id,
            lease: bodyAsJson,
          }),
        );
        break;

      default:
        yield put(notFoundById(id));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch lease by id with error "%s"', error);
    yield put(notFoundById(id));
  }
}

function* createLeaseSaga({ payload }): Generator<any, any, any> {
  try {
    const { area_search_id, ...lease } = payload;
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(createLease, lease);

    switch (statusCode) {
      case 201:
        if (area_search_id) {
          yield call(editSingleAreaSearchRequest, area_search_id, {
            state: AreaSearchState.SETTLED,
            lease: bodyAsJson,
            area_search_status: {
              status_notes: [
                {
                  note: "Päätetty",
                },
              ],
            },
          });
        }
        yield call(
          navigateTo,
          `${getRouteById(Routes.LEASES)}/${bodyAsJson.id}`,
        );
        yield put(receiveIsSaveClicked(false));
        yield put(hideEditMode());
        yield put(hideCreateModal());
        displayUIMessage({
          title: "",
          body: "Vuokraus luotu",
        });
        break;

      case 400:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({ ...bodyAsJson })));
        break;

      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to create lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  } finally {
    yield put(receiveIsCreateLeaseClicked(false));
  }
}

function* deleteLeaseSaga({ payload: leaseId }): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(deleteLease, leaseId);

    switch (statusCode) {
      case 204: {
        const query = getUrlParams(location.search);
        // Remove page specific url parameters when moving to lease list page
        delete query.tab;
        delete query.lease_area;
        delete query.plan_unit;
        delete query.plot;
        yield call(
          navigateTo,
          `${getRouteById(Routes.LEASES)}/${getSearchQuery(query)}`,
        );
        displayUIMessage({
          title: "",
          body: "Vuokraus poistettu",
        });
        break;
      }

      case 400:
      case 401:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({ ...bodyAsJson })));
        break;

      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to delete lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* patchLeaseSaga({ payload: lease }): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(patchLease, lease);

    switch (statusCode) {
      case 200:
        yield put(hideEditMode());
        yield put(receiveIsSaveClicked(false));
        yield put(
          fetchSingleLeaseAfterEdit({
            leaseId: lease.id,
            successMessage: "Vuokraus tallennettu",
          }),
        );
        break;

      case 400:
        yield put(notFound());
        yield put(
          receiveError(
            new SubmissionError({
              _error: "Server error 400",
              ...bodyAsJson,
            }),
          ),
        );
        break;

      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to edit lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* patchLeaseInvoiceNotesSaga({
  payload: lease,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(patchLease, lease);

    switch (statusCode) {
      case 200:
        yield put(hideEditMode());
        yield put(receiveIsSaveClicked(false));
        yield put(
          fetchSingleLeaseAfterEdit({
            leaseId: lease.id,
            successMessage: "Laskujen tiedotteet tallennettu",
          }),
        );
        break;

      case 403:
        yield put(notFound());
        yield put(
          receiveError(
            new SubmissionError({
              ...bodyAsJson,
            }),
          ),
        );
        break;

      case 400:
        yield put(notFound());
        yield put(
          receiveError(
            new SubmissionError({
              _error: "Server error 400",
              ...bodyAsJson,
            }),
          ),
        );
        break;

      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to edit lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* sendEmailSaga({
  payload,
}: {
  payload: SendEmailPayload;
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(sendEmail, payload);

    switch (statusCode) {
      case 200:
        yield put(
          fetchSingleLeaseAfterEdit({
            leaseId: payload.lease,
            successMessage: "Sähköposti lähetetty",
          }),
        );
        break;

      case 400:
        yield put(notFound());
        yield put(
          receiveError(
            new SubmissionError({
              _error: "Server error 400",
              ...bodyAsJson,
            }),
          ),
        );
        break;

      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to send email with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* startInvoicingSaga({ payload: leaseId }): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(startInvoicing, leaseId);

    switch (statusCode) {
      case 200: {
        const currentLease = yield select(getCurrentLease);
        yield put(
          receiveSingleLease({
            ...currentLease,
            invoicing_enabled_at: bodyAsJson.invoicing_enabled_at,
          }),
        );
        // Update invoice and invoice set lists after starting invoicing
        yield put(fetchInvoicesByLease(leaseId));
        yield put(fetchInvoiceSetsByLease(leaseId));
        displayUIMessage({
          title: "",
          body: "Laskutus käynnistetty",
        });
        break;
      }

      default:
        yield put(notFound());
        yield put(receiveError(new SubmissionError(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to start invoicing with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* stopInvoicingSaga({ payload: leaseId }): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(stopInvoicing, leaseId);

    switch (statusCode) {
      case 200: {
        const currentLease = yield select(getCurrentLease);
        yield put(
          receiveSingleLease({
            ...currentLease,
            invoicing_enabled_at: bodyAsJson.invoicing_enabled_at,
          }),
        );
        displayUIMessage({
          title: "",
          body: "Laskutus keskeytetty",
        });
        break;
      }

      default:
        yield put(notFound());
        yield put(receiveError(new SubmissionError(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to stop invoicing with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* setRentInfoCompleteSaga({
  payload: leaseId,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(setRentInfoComplete, leaseId);

    switch (statusCode) {
      case 200: {
        const currentLease = yield select(getCurrentLease);
        yield put(
          receiveSingleLease({
            ...currentLease,
            rent_info_completed_at: bodyAsJson.rent_info_completed_at,
          }),
        );
        displayUIMessage({
          title: "",
          body: "Vuokratiedot on merkattu olevan kunnossa",
        });
        break;
      }

      default:
        yield put(notFound());
        yield put(receiveError(new SubmissionError(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to set rent info complete with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* setRentInfoUncompleteSaga({
  payload: leaseId,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(setRentInfoUncomplete, leaseId);

    switch (statusCode) {
      case 200: {
        const currentLease = yield select(getCurrentLease);
        yield put(
          receiveSingleLease({
            ...currentLease,
            rent_info_completed_at: null,
          }),
        );
        displayUIMessage({
          title: "",
          body: "Vuokratiedot on merkattu keskeneräisiksi",
        });
        break;
      }

      default:
        yield put(notFound());
        yield put(receiveError(new SubmissionError(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to set rent info complete with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* createChargeSaga({ payload }): Generator<any, any, any> {
  try {
    const { leaseId } = payload;
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(createCharge, payload);

    switch (statusCode) {
      case 201:
        yield put(fetchInvoicesByLease(leaseId));
        yield put(fetchInvoiceSetsByLease(leaseId));
        yield put(receiveIsCreateInvoicePanelOpen(false));
        displayUIMessage({
          title: "",
          body: "Laskut luotu",
        });
        break;

      default:
        yield put(receiveError(new SubmissionError({ ...bodyAsJson })));
        break;
    }
  } catch (error) {
    console.error('Failed to create charge with error "%s"', error);
    yield put(receiveError(error));
  } finally {
    yield put(receiveIsCreateClicked(false));
  }
}

function* copyDecisionToLeasesSaga({ payload }): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
    } = yield call(copyDecisionToLeases, payload);

    switch (statusCode) {
      case 200:
        yield put(hideAttachDecisionModal());
        // Set isSaving flag to false
        yield put(notFound());
        displayUIMessage({
          title: "",
          body: "Päätös kopioitu vuokrauksiin",
        });
        break;

      default:
        displayUIMessage(
          {
            title: "",
            body: "Päätöksen kopioiminen vuokrauksiin epäonnistui",
          },
          {
            type: "error",
          },
        );
        // Set isSaving flag to false
        yield put(notFound());
        break;
    }
  } catch (error) {
    yield put(notFound());
    console.error('Failed to copy decision to leases with error "%s"', error);
    yield put(receiveError(error));
  }
}
function* fetchLeasesForContactAttributesSaga(): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchLeasesForContactAttributes);

    switch (statusCode) {
      case 200:
        yield put(receiveLeasesForContactAttributes(bodyAsJson.fields));
        break;

      default:
        yield put(leasesForContactAttributesNotFound());
        break;
    }
  } catch (error) {
    console.error(
      'Failed to fetch leases for contact attributes with error "%s"',
      error,
    );
    yield put(leasesForContactAttributesNotFound());
    yield put(receiveError(error));
  }
}
function* fetchLeasesForContactSaga({
  payload: query,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchLeasesForContact, query);

    switch (statusCode) {
      case 200:
        yield put(receiveLeasesForContact(bodyAsJson));
        break;

      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch leases for contact with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}
function* fetchLeasesForContractNumbersSaga({
  payload: query,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchLeases, query);

    switch (statusCode) {
      case 200:
        yield put(receiveLeasesForContractNumbers(bodyAsJson));
        break;

      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch leases with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([
    fork(function* (): Generator<any, any, any> {
      yield takeLatest(fetchAttributesAction, fetchAttributesSaga);
      yield takeLatest(fetchLeasesAction, fetchLeasesSaga);
      yield takeLatest(fetchLeasesByBBoxAction, fetchLeasesByBBoxSaga);
      yield takeLatest(fetchSingleLeaseAction, fetchSingleLeaseSaga);
      yield takeLatest(
        fetchSingleLeaseAfterEdit,
        fetchSingleLeaseAfterEditSaga,
      );
      yield takeEvery(fetchLeaseByIdAction, fetchLeaseByIdSaga);
      yield takeLatest(createLeaseAction, createLeaseSaga);
      yield takeLatest(deleteLeaseAction, deleteLeaseSaga);
      yield takeLatest(patchLeaseAction, patchLeaseSaga);
      yield takeLatest(
        patchLeaseInvoiceNotesAction,
        patchLeaseInvoiceNotesSaga,
      );
      yield takeLatest(sendEmailAction, sendEmailSaga);
      yield takeLatest(startInvoicingAction, startInvoicingSaga);
      yield takeLatest(stopInvoicingAction, stopInvoicingSaga);
      yield takeLatest(setRentInfoCompleteAction, setRentInfoCompleteSaga);
      yield takeLatest(setRentInfoUncompleteAction, setRentInfoUncompleteSaga);
      yield takeLatest(createChargeAction, createChargeSaga);
      yield takeLatest(copyDecisionToLeasesAction, copyDecisionToLeasesSaga);
      yield takeLatest(
        fetchLeasesForContractNumbersAction,
        fetchLeasesForContractNumbersSaga,
      );
      yield takeLatest(fetchLeasesForContactAction, fetchLeasesForContactSaga);
      yield takeLatest(
        fetchLeasesForContactAttributesAction,
        fetchLeasesForContactAttributesSaga,
      );
    }),
  ]);
}
