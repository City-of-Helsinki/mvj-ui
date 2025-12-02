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
import { displayUIMessage } from "@/util/helpers";
import {
  applicationRelatedFormNotFound,
  applicationRelatedPlotSearchNotFound,
  applicationsNotFound,
  fetchApplicationRelatedForm,
  fetchApplicationRelatedPlotSearch,
  fetchSinglePlotApplication,
  hideEditMode,
  notFoundByBBox,
  plotSearchSubtypesNotFound,
  receiveApplicationRelatedForm,
  receiveApplicationRelatedPlotSearch,
  receiveBatchInfoCheckEditFailure,
  receiveBatchInfoCheckEditSuccess,
  receiveFileOperationFinished,
  receivePlotApplicationSaved,
  receivePlotApplicationSaveFailed,
  receivePlotApplicationsByBBox,
  receivePlotApplicationsList,
  receivePlotSearchSubtypes,
  receiveSinglePlotApplication,
  receiveTargetInfoCheckMeetingMemoUploaded,
  receiveTargetInfoChecksForPlotSearch,
  showEditMode,
  singlePlotApplicationNotAllowed,
  singlePlotApplicationNotFound,
  targetInfoCheckMeetingMemoDeleteFailed,
  targetInfoCheckMeetingMemoUploadFailed,
  targetInfoChecksForPlotSearchNotFound,
} from "@/plotApplications/actions";
import { receiveError } from "@/api/actions";
import {
  createMeetingMemoRequest,
  createOpeningRecordRequest,
  deleteMeetingMemoRequest,
  editApplicantInfoCheckItemRequest,
  editOpeningRecordRequest,
  editTargetInfoCheckItemRequest,
  fetchPlotApplications,
  fetchPlotSearchSubtypesRequest,
  fetchSinglePlotApplication as fetchSinglePlotApplicationRequest,
  fetchTargetInfoChecksForPlotSearchRequest,
} from "@/plotApplications/requests";
import { fetchFormRequest, fetchSinglePlotSearch } from "@/plotSearch/requests";
import { getRouteById, Routes } from "@/root/routes";
import { getCurrentPlotApplication } from "@/plotApplications/selectors";
import {
  fetchApplicantInfoCheckAttributes,
  fetchApplicationRelatedAttachments,
  fetchFormAttributes,
  receiveUpdatedApplicantInfoCheckItem,
  receiveUpdatedTargetInfoCheckItem,
} from "@/application/actions";
import {
  createApplicationRequest,
  editApplicationRequest,
} from "@/application/requests";
import type {
  BatchEditPlotApplicationModelsAction,
  DeleteTargetInfoCheckMeetingMemoAction,
  InfoCheckBatchEditErrors,
  PlotApplication,
  UploadTargetInfoCheckMeetingMemoAction,
} from "@/plotApplications/types";

function* fetchPlotApplicationsSaga({
  payload: query,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchPlotApplications, query);

    switch (statusCode) {
      case 200:
        yield put(receivePlotApplicationsList(bodyAsJson));
        break;

      default:
        yield put(applicationsNotFound());
    }
  } catch (e) {
    console.error(e);
    yield put(applicationsNotFound());
  }
}

function* fetchPlotApplicationsByBBoxSaga({
  payload: query,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchPlotApplications, query);

    switch (statusCode) {
      case 200:
        yield put(receivePlotApplicationsByBBox(bodyAsJson));
        break;

      case 404:
      case 500:
        yield put(notFoundByBBox());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch applications with error "%s"', error);
    yield put(notFoundByBBox());
    yield put(receiveError(error));
  }
}

function* fetchSinglePlotApplicationSaga({
  payload: id,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchSinglePlotApplicationRequest, id);

    switch (statusCode) {
      case 200:
        yield put(receiveSinglePlotApplication(bodyAsJson));
        yield put(fetchApplicationRelatedForm(bodyAsJson.form));
        yield put(fetchApplicationRelatedAttachments(id));
        yield put(fetchFormAttributes(bodyAsJson.form));
        yield put(fetchApplicantInfoCheckAttributes());
        break;

      case 401:
      case 403:
        yield put(singlePlotApplicationNotAllowed());
        break;

      default:
        yield put(singlePlotApplicationNotFound());
    }
  } catch (e) {
    console.error(e);
    yield put(singlePlotApplicationNotFound());
  }
}

function* createPlotApplicationSaga({
  payload: plotApplication,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(createApplicationRequest, plotApplication);

    switch (statusCode) {
      case 200:
      case 201:
        yield put(receivePlotApplicationSaved(bodyAsJson.id));
        yield put(fetchSinglePlotApplication(bodyAsJson.id));
        yield call(
          navigateTo,
          `${getRouteById(Routes.PLOT_APPLICATIONS)}/${bodyAsJson.id}`,
        );
        yield put(hideEditMode());
        displayUIMessage({
          title: "",
          body: "Hakemus luotu",
        });
        break;

      default:
        yield put(receivePlotApplicationSaveFailed());
        displayUIMessage(
          {
            title: "",
            body: "Hakemuksen tallennus epäonnistui",
          },
          {
            type: "error",
          },
        );
    }
  } catch (e) {
    yield put(receivePlotApplicationSaveFailed());
    console.log(e);
    displayUIMessage(
      {
        title: "",
        body: "Hakemuksen tallennus epäonnistui",
      },
      {
        type: "error",
      },
    );
  }
}

function* editPlotApplicationSaga({
  payload: plotApplication,
  type: any,
}): Generator<any, any, any> {
  const handleFail = function* () {
    yield put(receivePlotApplicationSaveFailed());
    displayUIMessage(
      {
        title: "",
        body: "Hakemuksen tallennus epäonnistui",
      },
      {
        type: "error",
      },
    );
  };

  try {
    const currentPlotApplication: PlotApplication | null | undefined =
      yield select(getCurrentPlotApplication);

    if (!currentPlotApplication) {
      yield handleFail();
      return;
    }

    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(
      editApplicationRequest,
      currentPlotApplication?.id,
      plotApplication,
    );

    switch (statusCode) {
      case 200:
      case 201:
        yield put(receivePlotApplicationSaved(bodyAsJson.id));
        yield put(receiveSinglePlotApplication(bodyAsJson));
        yield put(fetchApplicationRelatedAttachments(bodyAsJson.id));
        yield put(hideEditMode());
        displayUIMessage({
          title: "",
          body: "Hakemus tallennettu",
        });
        break;

      default:
        yield handleFail();
    }
  } catch (e) {
    console.log(e);
    yield handleFail();
  }
}

function* fetchPlotSearchSubtypesSaga(): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchPlotSearchSubtypesRequest);

    switch (statusCode) {
      case 200:
        const subTypes = bodyAsJson.results;
        yield put(receivePlotSearchSubtypes(subTypes));
        break;

      case 403:
        yield put(plotSearchSubtypesNotFound());
        yield put(
          receiveError(
            new SubmissionError({ ...bodyAsJson, get: "plot_search_subtype" }),
          ),
        );
        break;

      default:
        yield put(plotSearchSubtypesNotFound());
        break;
    }
  } catch (error) {
    console.error(
      'Failed to fetch plot search subtypes with error "%s"',
      error,
    );
    yield put(plotSearchSubtypesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchApplicationRelatedFormSaga({
  payload: id,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchFormRequest, id);

    switch (statusCode) {
      case 200:
        yield put(receiveApplicationRelatedForm(bodyAsJson));
        yield put(fetchApplicationRelatedPlotSearch(bodyAsJson.plot_search_id));
        break;

      default:
        yield put(applicationRelatedFormNotFound());
        displayUIMessage(
          {
            title: "",
            body: "Hakemukseen liittyvää lomaketta ei löytynyt!",
          },
          {
            type: "error",
          },
        );
    }
  } catch {
    yield put(applicationRelatedFormNotFound());
    displayUIMessage(
      {
        title: "",
        body: "Hakemukseen liittyvää lomaketta ei löytynyt!",
      },
      {
        type: "error",
      },
    );
  }
}

function* fetchApplicationRelatedPlotSearchSaga({
  payload: id,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchSinglePlotSearch, id);

    switch (statusCode) {
      case 200:
        yield put(receiveApplicationRelatedPlotSearch(bodyAsJson));
        break;

      case 404:
        yield put(applicationRelatedPlotSearchNotFound());
        yield put(receiveError(new SubmissionError({ ...bodyAsJson })));
        break;

      default:
        yield put(applicationRelatedPlotSearchNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch plot search with error "%s"', error);
    yield put(applicationRelatedPlotSearchNotFound());
    yield put(receiveError(error));
  }
}

function* fetchTargetInfoChecksForPlotSearchSaga({
  payload: id,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchTargetInfoChecksForPlotSearchRequest, id);

    switch (statusCode) {
      case 200:
        yield put(receiveTargetInfoChecksForPlotSearch(bodyAsJson.results));
        break;

      default:
        yield put(targetInfoChecksForPlotSearchNotFound());
        displayUIMessage(
          {
            title: "",
            body: "Hakuun liittyvien hakemusten tietojen lataaminen epäonnistui!",
          },
          {
            type: "error",
          },
        );
    }
  } catch (e) {
    yield put(targetInfoChecksForPlotSearchNotFound());
    displayUIMessage(
      {
        title: "",
        body: "Hakuun liittyvien hakemusten tietojen lataaminen epäonnistui!",
      },
      {
        type: "error",
      },
    );
  }
}

function* uploadMeetingMemoSaga({
  payload,
  type: any,
}: UploadTargetInfoCheckMeetingMemoAction): Generator<any, any, any> {
  try {
    const { fileData, targetInfoCheck, callback } = payload;
    const {
      response: { status: statusCode },
      bodyAsJson,
      // @ts-ignore: No overload matches this request
    } = yield call(createMeetingMemoRequest, {
      file: fileData,
      name: fileData.name,
      targetInfoCheck,
    });

    switch (statusCode) {
      case 201:
        yield put(receiveTargetInfoCheckMeetingMemoUploaded());

        if (callback) {
          callback(bodyAsJson);
        }

        displayUIMessage({
          title: "",
          body: "Kokousmuistio lisätty",
        });
        break;

      default:
        yield put(targetInfoCheckMeetingMemoUploadFailed());
        displayUIMessage(
          {
            title: "",
            body: "Kokousmuistion tallennus epäonnistui",
          },
          {
            type: "error",
          },
        );
    }
  } catch (e) {
    console.log(e);
    yield put(targetInfoCheckMeetingMemoUploadFailed());
    displayUIMessage(
      {
        title: "",
        body: "Kokousmuistion tallennus epäonnistui",
      },
      {
        type: "error",
      },
    );
    throw e;
  }
}

function* deleteMeetingMemoSaga({
  payload,
  type: any,
}: DeleteTargetInfoCheckMeetingMemoAction): Generator<any, any, any> {
  try {
    const { file, callback } = payload;
    const {
      response: { status: statusCode },
    } = yield call(deleteMeetingMemoRequest, file.id);

    switch (statusCode) {
      case 200:
      case 204:
        yield put(receiveFileOperationFinished());

        if (callback) {
          callback();
        }

        displayUIMessage({
          title: "",
          body: "Kokousmuistio poistettu",
        });
        break;

      default:
        yield put(targetInfoCheckMeetingMemoDeleteFailed());
        displayUIMessage(
          {
            title: "",
            body: "Kokousmuistion poistaminen epäonnistui",
          },
          {
            type: "error",
          },
        );
    }
  } catch (e) {
    console.error(e);
    yield put(targetInfoCheckMeetingMemoDeleteFailed());
    displayUIMessage(
      {
        title: "",
        body: "Kokousmuistion poistaminen epäonnistui",
      },
      {
        type: "error",
      },
    );
    throw e;
  }
}

function* batchEditPlotApplicationModelsSaga({
  payload,
  type: any,
}: BatchEditPlotApplicationModelsAction): Generator<any, any, any> {
  const errors: InfoCheckBatchEditErrors = {
    target: [],
    applicant: [],
    openingRecord: null,
  };
  yield all(
    payload.target.map((target) =>
      call(function* ({ id, targetForm, data }) {
        try {
          const {
            response: { status: statusCode },
            bodyAsJson,
          } = yield call(editTargetInfoCheckItemRequest, data);

          switch (statusCode) {
            case 200:
            case 204:
              yield put(
                receiveUpdatedTargetInfoCheckItem({
                  targetForm,
                  data: bodyAsJson,
                }),
              );
              break;

            default:
              console.error(bodyAsJson);
              errors.target.push({
                id,
                error: bodyAsJson,
              });
          }
        } catch (e) {
          console.error(e);
          errors.target.push({
            id,
            error: e,
          });
        }
      }, target),
    ),
  );
  yield all(
    payload.applicant.map((applicant) =>
      call(function* ({ id, kind, data }) {
        try {
          const {
            response: { status: statusCode },
            bodyAsJson,
          } = yield call(editApplicantInfoCheckItemRequest, data);

          switch (statusCode) {
            case 200:
            case 204:
              yield put(
                receiveUpdatedApplicantInfoCheckItem({
                  id: data.id,
                  data: bodyAsJson,
                }),
              );
              break;

            default:
              console.error(bodyAsJson);
              errors.applicant.push({
                id,
                kind,
                error: bodyAsJson,
              });
          }
        } catch (e) {
          console.error(e);
          errors.applicant.push({
            id,
            kind,
            error: e,
          });
        }
      }, applicant),
    ),
  );

  if (payload.opening_record) {
    yield call(function* () {
      try {
        const {
          response: { status: statusCode },
          bodyAsJson,
        } = yield call(editOpeningRecordRequest, payload.opening_record);

        switch (statusCode) {
          case 200:
          case 204:
            break;

          default:
            console.error(bodyAsJson);
            errors.openingRecord = bodyAsJson;
        }
      } catch (e: any) {
        console.error(e);
        errors.openingRecord = e;
      }
    });
  }

  const errorCount =
    errors.target.length +
    errors.applicant.length +
    (errors.openingRecord ? 1 : 0);

  if (errorCount === 0) {
    const currentPlotApplication = yield select(getCurrentPlotApplication);
    yield put(receiveBatchInfoCheckEditSuccess());
    yield put(fetchSinglePlotApplication(currentPlotApplication.id));
    yield put(hideEditMode());
    displayUIMessage({
      title: "",
      body: "Käsittelytiedot päivitetty",
    });
  } else {
    yield put(receiveBatchInfoCheckEditFailure(errors));
    displayUIMessage(
      {
        title: "",
        body: `${errorCount} käsittelytiedon päivitys epäonnistui!`,
      },
      {
        type: "error",
      },
    );
  }
}

function* createOpeningRecordSaga({
  payload: id,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
    } = yield call(createOpeningRecordRequest, id);

    switch (statusCode) {
      case 200:
      case 201:
        yield call(
          navigateTo,
          `${getRouteById(Routes.PLOT_APPLICATIONS)}/${id}`,
        );
        yield put(showEditMode());
        displayUIMessage({
          title: "",
          body: "Hakemus avattu",
        });
        break;

      default:
        yield put(receivePlotApplicationSaveFailed());
        displayUIMessage(
          {
            title: "",
            body: "Hakemuksen avaaminen epäonnistui",
          },
          {
            type: "error",
          },
        );
    }
  } catch (e) {
    yield put(receivePlotApplicationSaveFailed());
    console.log(e);
    displayUIMessage(
      {
        title: "",
        body: "Hakemuksen avaaminen epäonnistui",
      },
      {
        type: "error",
      },
    );
  }
}

export default function* (): Generator<any, any, any> {
  yield all([
    fork(function* (): Generator<any, any, any> {
      yield takeLatest(
        "mvj/plotApplications/FETCH_ALL",
        fetchPlotApplicationsSaga,
      );
      yield takeLatest(
        "mvj/plotApplications/FETCH_SINGLE",
        fetchSinglePlotApplicationSaga,
      );
      yield takeLatest(
        "mvj/plotApplications/FETCH_BY_BBOX",
        fetchPlotApplicationsByBBoxSaga,
      );
      yield takeLatest(
        "mvj/plotApplications/CREATE",
        createPlotApplicationSaga,
      );
      yield takeLatest("mvj/plotApplications/EDIT", editPlotApplicationSaga);
      yield takeLatest(
        "mvj/plotApplications/FETCH_PLOT_SEARCH_SUB_TYPES",
        fetchPlotSearchSubtypesSaga,
      );
      yield takeLatest(
        "mvj/plotApplications/FETCH_FORM",
        fetchApplicationRelatedFormSaga,
      );
      yield takeLatest(
        "mvj/plotApplications/FETCH_PLOT_SEARCH",
        fetchApplicationRelatedPlotSearchSaga,
      );
      yield takeLatest(
        "mvj/plotApplications/FETCH_TARGET_INFO_CHECKS_FOR_PLOT_SEARCH",
        fetchTargetInfoChecksForPlotSearchSaga,
      );
      yield takeEvery(
        "mvj/plotApplications/UPLOAD_MEETING_MEMO",
        uploadMeetingMemoSaga,
      );
      yield takeEvery(
        "mvj/plotApplications/DELETE_MEETING_MEMO",
        deleteMeetingMemoSaga,
      );
      yield takeLatest(
        "mvj/plotApplications/BATCH_EDIT_RELATED_MODELS",
        batchEditPlotApplicationModelsSaga,
      );
      yield takeLatest(
        "mvj/plotApplications/CREATE_OPENING_RECORD",
        createOpeningRecordSaga,
      );
    }),
  ]);
}
