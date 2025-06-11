import {
  all,
  call,
  fork,
  put,
  select,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import { push } from "react-router-redux";
import { SubmissionError } from "redux-form";
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
  receiveIsSaveClicked,
  receiveLeases,
  receiveLeasesByBBox,
  receiveSingleLease,
  receiveLeaseById,
  receiveLeasesForContractNumbers,
} from "./actions";
import { receiveError } from "@/api/actions";
import {
  fetchInvoicesByLease,
  receiveIsCreateInvoicePanelOpen,
} from "@/invoices/actions";
import { fetchInvoiceSetsByLease } from "@/invoiceSets/actions";
import { displayUIMessage, getSearchQuery, getUrlParams } from "@/util/helpers";
import {
  copyAreasToContract,
  copyDecisionToLeases,
  createCharge,
  createLease,
  deleteLease,
  fetchAttributes,
  fetchLeases,
  fetchSingleLease,
  patchLease,
  sendEmail,
  startInvoicing,
  stopInvoicing,
  setRentInfoComplete,
  setRentInfoUncomplete,
} from "./requests";
import { getCurrentLease } from "./selectors";
import { editSingleAreaSearchRequest } from "@/areaSearch/requests";
import { AreaSearchState } from "@/plotSearch/enums";

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
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
    console.error('Failed to fetch attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchLeasesSaga({
  payload: query,
  type: any,
}): Generator<any, any, any> {
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
    }
  } catch (error) {
    console.error('Failed to fetch leases with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchLeasesByBBoxSaga({
  payload: query,
  type: any,
}): Generator<any, any, any> {
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

function* fetchSingleLeaseSaga({
  payload: id,
  type: any,
}): Generator<any, any, any> {
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

function* fetchSingleLeaseAfterEditSaga({
  payload,
  type: any,
}): Generator<any, any, any> {
  try {
    const callbackFunctions = payload.callbackFunctions;
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchSingleLease, payload.leaseId);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleLease(bodyAsJson));

        if (callbackFunctions) {
          for (let i = 0; i < callbackFunctions.length; i++) {
            switch (typeof callbackFunctions[i]) {
              case "function":
                // Functions
                callbackFunctions[i]();
                break;

              case "object":
                // Redux saga functions
                yield put(callbackFunctions[i]);
            }
          }
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

function* fetchLeaseByIdSaga({
  payload: id,
  type: any,
}): Generator<any, any, any> {
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

function* createLeaseSaga({ payload, type: any }): Generator<any, any, any> {
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
        yield put(push(`${getRouteById(Routes.LEASES)}/${bodyAsJson.id}`));
        yield put(receiveIsSaveClicked(false));
        yield put(hideEditMode());
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
  }
}

function* createLeaseAndUpdateCurrentLeaseSaga({
  payload: lease,
  type: any,
}): Generator<any, any, any> {
  try {
    const currentLease = lease.relate_to;
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(createLease, lease);

    switch (statusCode) {
      case 201:
        yield put(
          fetchSingleLeaseAfterEdit({
            leaseId: currentLease,
            callbackFunctions: [
              hideCreateModal(),
              receiveIsSaveClicked(false),
              () =>
                displayUIMessage({
                  title: "",
                  body: "Vuokraus luotu",
                }),
            ],
          }),
        );
        break;

      default:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to create lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* deleteLeaseSaga({
  payload: leaseId,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(deleteLease, leaseId);

    switch (statusCode) {
      case 204:
        const query = getUrlParams(location.search);
        // Remove page specific url parameters when moving to lease list page
        delete query.tab;
        delete query.lease_area;
        delete query.plan_unit;
        delete query.plot;
        yield put(
          push(`${getRouteById(Routes.LEASES)}/${getSearchQuery(query)}`),
        );
        displayUIMessage({
          title: "",
          body: "Vuokraus poistettu",
        });
        break;

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

function* patchLeaseSaga({
  payload: lease,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(patchLease, lease);

    switch (statusCode) {
      case 200:
        yield put(
          fetchSingleLeaseAfterEdit({
            leaseId: lease.id,
            callbackFunctions: [
              hideEditMode(),
              receiveIsSaveClicked(false),
              () =>
                displayUIMessage({
                  title: "",
                  body: "Vuokraus tallennettu",
                }),
            ],
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
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(patchLease, lease);

    switch (statusCode) {
      case 200:
        yield put(
          fetchSingleLeaseAfterEdit({
            leaseId: lease.id,
            callbackFunctions: [
              hideEditMode(),
              receiveIsSaveClicked(false),
              () =>
                displayUIMessage({
                  title: "",
                  body: "Laskujen tiedotteet tallennettu",
                }),
            ],
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

function* sendEmailSaga({ payload, type: any }): Generator<any, any, any> {
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
            callbackFunctions: [
              () =>
                displayUIMessage({
                  title: "",
                  body: "Sähköposti lähetetty",
                }),
            ],
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

function* startInvoicingSaga({
  payload: leaseId,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(startInvoicing, leaseId);

    switch (statusCode) {
      case 200:
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

function* stopInvoicingSaga({
  payload: leaseId,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(stopInvoicing, leaseId);

    switch (statusCode) {
      case 200:
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
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(setRentInfoComplete, leaseId);

    switch (statusCode) {
      case 200:
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
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(setRentInfoUncomplete, leaseId);

    switch (statusCode) {
      case 200:
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

function* createChargeSaga({ payload, type: any }): Generator<any, any, any> {
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
  }
}

function* copyAreasToContractSaga({
  payload: leaseId,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(copyAreasToContract, leaseId);

    switch (statusCode) {
      case 200:
        yield put(
          fetchSingleLeaseAfterEdit({
            leaseId: leaseId,
            callbackFunctions: [
              () =>
                displayUIMessage({
                  title: "",
                  body: "Kopioitu sopimukseen",
                }),
            ],
          }),
        );
        break;

      default:
        yield put(receiveError(new SubmissionError({ ...bodyAsJson })));
        break;
    }
  } catch (error) {
    console.error(
      'Failed to copy lease areas to contract with error "%s"',
      error,
    );
    yield put(receiveError(error));
  }
}

function* copyDecisionToLeasesSaga({
  payload,
  type: any,
}): Generator<any, any, any> {
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

function* fetchLeasesForContractNumbersSaga({
  payload: query,
  type: any,
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
      yield takeLatest("mvj/leases/FETCH_ATTRIBUTES", fetchAttributesSaga);
      yield takeLatest("mvj/leases/FETCH_ALL", fetchLeasesSaga);
      yield takeLatest("mvj/leases/FETCH_BY_BBOX", fetchLeasesByBBoxSaga);
      yield takeLatest("mvj/leases/FETCH_SINGLE", fetchSingleLeaseSaga);
      yield takeLatest(
        "mvj/leases/FETCH_SINGLE_AFTER_EDIT",
        fetchSingleLeaseAfterEditSaga,
      );
      yield takeEvery("mvj/leases/FETCH_BY_ID", fetchLeaseByIdSaga);
      yield takeLatest("mvj/leases/CREATE", createLeaseSaga);
      yield takeLatest(
        "mvj/leases/CREATE_AND_UPDATE",
        createLeaseAndUpdateCurrentLeaseSaga,
      );
      yield takeLatest("mvj/leases/DELETE", deleteLeaseSaga);
      yield takeLatest("mvj/leases/PATCH", patchLeaseSaga);
      yield takeLatest(
        "mvj/leases/PATCH_INVOICE_NOTES",
        patchLeaseInvoiceNotesSaga,
      );
      yield takeLatest("mvj/leases/SEND_EMAIL", sendEmailSaga);
      yield takeLatest("mvj/leases/START_INVOICING", startInvoicingSaga);
      yield takeLatest("mvj/leases/STOP_INVOICING", stopInvoicingSaga);
      yield takeLatest(
        "mvj/leases/SET_RENT_INFO_COMPLETE",
        setRentInfoCompleteSaga,
      ),
        yield takeLatest(
          "mvj/leases/SET_RENT_INFO_UNCOMPLETE",
          setRentInfoUncompleteSaga,
        ),
        yield takeLatest("mvj/leases/CREATE_CHARGE", createChargeSaga);
      yield takeLatest(
        "mvj/leases/COPY_AREAS_TO_CONTRACT",
        copyAreasToContractSaga,
      );
      yield takeLatest(
        "mvj/leases/COPY_DECISION_TO_LEASES",
        copyDecisionToLeasesSaga,
      );
      yield takeLatest(
        "mvj/leases/FETCH_LEASES_FOR_CONTRACT_NUMBERS",
        fetchLeasesForContractNumbersSaga,
      );
    }),
  ]);
}
