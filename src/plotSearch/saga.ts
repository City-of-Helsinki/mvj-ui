import { all, fork, put, takeLatest, call, takeEvery, take } from "redux-saga/effects";
import { push } from "react-router-redux";
import { SubmissionError } from "redux-form";
import { displayUIMessage, getSearchQuery, getUrlParams } from "util/helpers";
import { hideEditMode, receiveAttributes, receivePlotSearchList, receiveSinglePlotSearch, receiveMethods, attributesNotFound, notFound, receiveIsSaveClicked, fetchSinglePlotSearchAfterEdit, receivePlanUnitAttributes, planUnitAttributesNotFound, receiveSinglePlanUnit, planUnitNotFound, customDetailedPlanAttributesNotFound, customDetailedPlanNotFound, receiveCustomDetailedPlanAttributes, receiveSingleCustomDetailedPlan, receivePlotSearchSubtype, plotSearchSubtypesNotFound, nullPlanUnits, receiveForm, formNotFound, fetchTemplateForms, receiveTemplateForms, templateFormsNotFound, addPlanUnitDecisions, resetPlanUnitDecisions, editForm, receiveStages, stagesNotFound, fetchStages, reservationIdentifiersCreated, reservationIdentifiersCreationFailed, reservationIdentifierUnitListsNotFound, receiveReservationIdentifierUnitLists, directReservationLinkCreated, directReservationLinkCreationFailed, receivePlotSearchRelatedApplications, plotSearchRelatedApplicationsNotFound, fetchPlotSearchRelatedApplications } from "/src/plotSearch/actions";
import { receiveError } from "/src/api/actions";
import { getRouteById, Routes } from "/src/root/routes";
import { fetchAttributes, createPlotSearch, fetchPlotSearches, fetchSinglePlotSearch, editPlotSearch as editPlotSearchRequest, deletePlotSearch, fetchPlanUnitAttributes, fetchPlanUnit, fetchCustomDetailedPlanAttributes, fetchCustomDetailedPlan, fetchPlotSearchSubtypesRequest, fetchFormRequest, fetchTemplateFormsRequest, editFormRequest, fetchStagesRequest, editTargetPlotSearchRelationRequest, fetchAllMunicipalitiesRequest, fetchAllDistrictsRequest, createDirectReservationLinkRequest, fetchPlotSearchApplicationsRequest, createPlotSearchApplicationsOpeningRecords } from "/src/plotSearch/requests";
import { createLease } from "/src/leases/requests";
import { RelationTypes } from "/src/leases/enums";
import { fetchLeaseTypes } from "/src/leaseType/requests";
import { fetchFormAttributes } from "/src/application/actions";

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
        const attributes = { ...bodyAsJson.fields
        };
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

function* fetchPlotSearchSaga({
  payload: query,
  type: string
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchPlotSearches, query);

    switch (statusCode) {
      case 200:
        yield put(receivePlotSearchList({
          count: bodyAsJson.count,
          results: bodyAsJson.results
        }));
        break;

      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch plot searches with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchSinglePlotSearchSaga({
  payload: id,
  type: string
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchSinglePlotSearch, id);

    switch (statusCode) {
      case 200:
        yield put(receiveSinglePlotSearch({ ...bodyAsJson
        }));
        yield put(fetchTemplateForms());
        yield put(fetchStages());

        if (bodyAsJson.form) {
          yield put(fetchFormAttributes(bodyAsJson.form.id));
          yield put(receiveForm(bodyAsJson.form));
        } else {
          yield put(receiveForm(null));
        }

        yield put(resetPlanUnitDecisions());

        for (const target of bodyAsJson.plot_search_targets) {
          if (target.plan_unit) {
            yield put(addPlanUnitDecisions(target.plan_unit));
          }
        }

        break;

      case 404:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({ ...bodyAsJson
        })));
        break;

      default:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch plot search with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchTemplateFormsSaga(): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchTemplateFormsRequest);

    switch (statusCode) {
      case 200:
        yield put(receiveTemplateForms(bodyAsJson.results));
        break;

      case 404:
        yield put(templateFormsNotFound());
        yield put(receiveError(new SubmissionError({ ...bodyAsJson
        })));
        break;

      default:
        yield put(templateFormsNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch form templates with error "%s"', error);
    yield put(templateFormsNotFound());
    yield put(receiveError(error));
  }
}

function* createPlotSearchSaga({
  payload: plotSearch,
  type: string
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(createPlotSearch, plotSearch);

    switch (statusCode) {
      case 201:
        yield put(push(`${getRouteById(Routes.PLOT_SEARCH)}/${bodyAsJson.id}`));
        yield put(receiveIsSaveClicked(false));
        displayUIMessage({
          title: '',
          body: 'Tonttihaku luotu'
        });
        break;

      case 400:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({ ...bodyAsJson
        })));
        break;

      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to create plot search with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* editPlotSearchSaga({
  payload: {
    basicInfo,
    form,
    openingRecord
  },
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(editPlotSearchRequest, basicInfo);

    switch (statusCode) {
      case 200:
        if (form && form.id === bodyAsJson.form?.id) {
          yield put(editForm(form));
          const result = yield take(['mvj/plotSearch/RECEIVE_FORM', 'mvj/api/RECEIVE_ERROR']);

          if (result.type === 'mvj/api/RECEIVE_ERROR') {
            yield receiveIsSaveClicked(false);
            break;
          }
        }

        if (openingRecord) {
          const {
            response: {
              status: openingRecordStatus
            },
            bodyAsJson: openingRecordBody
          } = yield call(createPlotSearchApplicationsOpeningRecords, basicInfo.id, openingRecord);

          if (![200, 201, 204].includes(openingRecordStatus)) {
            yield put(receiveError(new SubmissionError({
              post: 'open_answers',
              ...openingRecordBody
            })));
            yield receiveIsSaveClicked(false);
            break;
          }
        }

        yield put(fetchSinglePlotSearchAfterEdit({
          id: basicInfo.id,
          callbackFunctions: [hideEditMode(), fetchPlotSearchRelatedApplications(basicInfo.id), receiveIsSaveClicked(false), () => displayUIMessage({
            title: '',
            body: 'Tonttihaku tallennettu'
          }), nullPlanUnits()]
        }));
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
    console.error('Failed to edit plot search with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchSinglePlotSearchAfterEditSaga({
  payload,
  type: any
}): Generator<any, any, any> {
  try {
    const callbackFunctions = payload.callbackFunctions;
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchSinglePlotSearch, payload.id);

    switch (statusCode) {
      case 200:
        yield put(receiveSinglePlotSearch(bodyAsJson));

        if (bodyAsJson.form) {
          yield put(fetchFormAttributes(bodyAsJson.form.id));
          yield put(receiveForm(bodyAsJson.form));
        } else {
          yield put(receiveForm(null));
        }

        if (callbackFunctions) {
          for (let i = 0; i < callbackFunctions.length; i++) {
            switch (typeof callbackFunctions[i]) {
              case 'function':
                // Functions
                callbackFunctions[i]();
                break;

              case 'object':
                // Redux saga functions
                yield put(callbackFunctions[i]);
            }
          }
        }

        break;

      case 404:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({ ...bodyAsJson
        })));
        break;

      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch Land Use Contracts with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* deletePlotSearchSaga({
  payload: id,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(deletePlotSearch, id);

    switch (statusCode) {
      case 204:
        const query = getUrlParams(location.search);
        // Remove page specific url parameters when moving to landuse list page
        delete query.tab;
        yield put(push(`${getRouteById(Routes.PLOT_SEARCH)}/${getSearchQuery(query)}`));
        displayUIMessage({
          title: '',
          body: 'Tonttihaku poistettu'
        });
        break;

      case 400:
      case 401:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({ ...bodyAsJson
        })));
        break;

      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to delete landusecontract with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchPlanUnitAttributesSaga(): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchPlanUnitAttributes);

    switch (statusCode) {
      case 200:
        const attributes = bodyAsJson.fields;
        yield put(receivePlanUnitAttributes(attributes));
        break;

      default:
        yield put(planUnitAttributesNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch plan unit attributes with error "%s"', error);
    yield put(planUnitAttributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchPlanUnitSaga({
  payload: value,
  type: any
}): Generator<any, any, any> {
  const id = value?.value;

  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchPlanUnit, id);

    switch (statusCode) {
      case 200:
        yield put(receiveSinglePlanUnit({
          [id]: bodyAsJson
        }));
        yield put(addPlanUnitDecisions(bodyAsJson));
        break;

      case 404:
        yield put(planUnitNotFound());
        yield put(receiveError(new SubmissionError({ ...bodyAsJson
        })));
        break;

      default:
        yield put(planUnitNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch planUnit with error "%s"', error);
    yield put(planUnitNotFound());
    yield put(receiveError(error));
  }
}

function* fetchCustomDetailedPlanAttributesSaga(): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchCustomDetailedPlanAttributes);

    switch (statusCode) {
      case 200:
        const attributes = bodyAsJson.fields;
        yield put(receiveCustomDetailedPlanAttributes(attributes));
        break;

      default:
        yield put(customDetailedPlanAttributesNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch custom detailed plan attributes with error "%s"', error);
    yield put(customDetailedPlanAttributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchCustomDetailedPlanSaga({
  payload: value,
  type: any
}): Generator<any, any, any> {
  const id = value?.value;

  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchCustomDetailedPlan, id);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleCustomDetailedPlan({
          [id]: bodyAsJson
        }));
        break;

      case 404:
        yield put(customDetailedPlanNotFound());
        yield put(receiveError(new SubmissionError({ ...bodyAsJson
        })));
        break;

      default:
        yield put(customDetailedPlanNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch custom detailed plan with error "%s"', error);
    yield put(customDetailedPlanNotFound());
    yield put(receiveError(error));
  }
}

function* fetchPlotSearchSubtypesSaga(): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchPlotSearchSubtypesRequest);

    switch (statusCode) {
      case 200:
        const subTypes = bodyAsJson.results;
        yield put(receivePlotSearchSubtype(subTypes));
        break;

      case 403:
        yield put(plotSearchSubtypesNotFound());
        yield put(receiveError(new SubmissionError({ ...bodyAsJson,
          get: 'plot_search_subtype'
        })));
        break;

      default:
        yield put(plotSearchSubtypesNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch plot search subtypes with error "%s"', error);
    yield put(plotSearchSubtypesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchFormSaga({
  payload: id,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchFormRequest, id);

    switch (statusCode) {
      case 200:
        yield put(receiveForm(bodyAsJson));
        break;

      case 404:
        yield put(formNotFound());
        yield put(receiveError(new SubmissionError({ ...bodyAsJson
        })));
        break;

      default:
        yield put(formNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch form with error "%s"', error);
    yield put(formNotFound());
    yield put(receiveError(error));
  }
}

function* editFormSaga({
  payload: form,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(editFormRequest, form);

    switch (statusCode) {
      case 200:
        yield put(receiveForm(bodyAsJson));
        break;

      case 400:
        yield put(receiveError(new SubmissionError({
          _error: 'Server error 400',
          ...bodyAsJson
        })));
        break;

      case 500:
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to edit form with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* fetchStagesSaga(): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchStagesRequest);

    switch (statusCode) {
      case 200:
        yield put(receiveStages(bodyAsJson.results));
        break;

      case 403:
        yield put(stagesNotFound());
        yield put(receiveError(new SubmissionError({ ...bodyAsJson,
          get: 'plot_search_stage'
        })));
        break;

      default:
        yield put(stagesNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch plot search stages with error "%s"', error);
    yield put(stagesNotFound());
    yield put(receiveError(error));
  }
}

function* batchCreateReservationIdentifiersSaga({
  payload,
  type: any
}): Generator<any, any, any> {
  const errors: Array<any> = [];
  yield all(payload.data.map(row => call(function* (row) {
    try {
      const {
        response: {
          status: statusCode
        },
        bodyAsJson
      } = yield call(createLease, {
        type: row.type,
        state: row.state,
        municipality: row.municipality,
        district: row.district,
        relate_to: row.leaseId,
        relation_type: RelationTypes.TRANSFER
      });

      switch (statusCode) {
        case 200:
        case 201:
          const {
            response: {
              status: targetRelationEditStatusCode
            },
            bodyAsJson: targetRelationEditBodyAsJson
          } = yield call(editTargetPlotSearchRelationRequest, {
            id: row.targetId,
            reservation_identifier: bodyAsJson.id
          });

          if (targetRelationEditStatusCode !== 200) {
            errors.push({
              id: row.targetId,
              error: targetRelationEditBodyAsJson
            });
          }

          break;

        default:
          console.error(bodyAsJson);
          errors.push({
            id: row.targetId,
            error: bodyAsJson
          });
      }
    } catch (e) {
      console.error(e);
      errors.push({
        id: row.targetId,
        error: e
      });
    }
  }, row)));

  if (errors.length > 0) {
    yield put(reservationIdentifiersCreationFailed(errors));
    displayUIMessage({
      title: '',
      body: 'Vuokratunnusten luonti keskeytyi virheeseen!'
    }, {
      type: 'error'
    });
  } else {
    yield put(reservationIdentifiersCreated());
    displayUIMessage({
      title: '',
      body: 'Varaustunnukset luotu'
    });

    if (payload.callback) {
      payload.callback();
    }
  }
}

function* fetchReservationIdentifierUnitListsSaga(): Generator<any, any, any> {
  const {
    response: typeResponse,
    bodyAsJson: typeBody
  } = yield call(fetchLeaseTypes);
  const {
    response: municipalityResponse,
    bodyAsJson: municipalityBody
  } = yield call(fetchAllMunicipalitiesRequest);
  const {
    response: districtResponse,
    bodyAsJson: districtBody
  } = yield call(fetchAllDistrictsRequest);

  if (typeResponse.status !== 200 || municipalityResponse.status !== 200 || districtResponse.status !== 200) {
    yield put(reservationIdentifierUnitListsNotFound());
  } else {
    yield put(receiveReservationIdentifierUnitLists({
      types: typeBody.results,
      municipalities: municipalityBody.results,
      districts: districtBody.results
    }));
  }
}

function* createDirectReservationLinkSaga({
  payload,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      data,
      callBack
    } = payload;
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(createDirectReservationLinkRequest, data);

    switch (statusCode) {
      case 200:
      case 201:
        yield put(directReservationLinkCreated());
        displayUIMessage({
          title: 'Suoravarauslinkki lähetetty',
          body: `Suoravarauslinkki: ${bodyAsJson.url}`
        });
        callBack();
        break;

      default:
        yield put(directReservationLinkCreationFailed());
        displayUIMessage({
          title: '',
          body: 'Suoravarauslinkin lähetys epäonnistui'
        }, {
          type: 'error'
        });
    }
  } catch (e) {
    yield put(directReservationLinkCreationFailed());
    console.log(e);
    displayUIMessage({
      title: '',
      body: 'Suoravarauslinkin lähetys epäonnistui'
    }, {
      type: 'error'
    });
  }
}

function* fetchRelatedApplicationsSaga({
  payload: id,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchPlotSearchApplicationsRequest, id);

    switch (statusCode) {
      case 200:
        yield put(receivePlotSearchRelatedApplications(bodyAsJson.results));
        break;

      case 403:
        yield put(plotSearchRelatedApplicationsNotFound());
        yield put(receiveError(new SubmissionError({ ...bodyAsJson,
          get: 'answer'
        })));
        break;

      default:
        yield put(plotSearchRelatedApplicationsNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch plot search related applications with error "%s"', error);
    yield put(plotSearchRelatedApplicationsNotFound());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/plotSearch/FETCH_ATTRIBUTES', fetchAttributesSaga);
    yield takeLatest('mvj/plotSearch/FETCH_ALL', fetchPlotSearchSaga);
    yield takeLatest('mvj/plotSearch/FETCH_SINGLE', fetchSinglePlotSearchSaga);
    yield takeLatest('mvj/plotSearch/CREATE', createPlotSearchSaga);
    yield takeLatest('mvj/plotSearch/EDIT', editPlotSearchSaga);
    yield takeLatest('mvj/plotSearch/FETCH_SINGLE_AFTER_EDIT', fetchSinglePlotSearchAfterEditSaga);
    yield takeLatest('mvj/plotSearch/DELETE', deletePlotSearchSaga);
    yield takeLatest('mvj/plotSearch/FETCH_TEMPLATE_FORMS', fetchTemplateFormsSaga);
    yield takeEvery('mvj/plotSearch/FETCH_PLAN_UNIT_ATTRIBUTES', fetchPlanUnitAttributesSaga);
    yield takeEvery('mvj/plotSearch/FETCH_PLAN_UNIT', fetchPlanUnitSaga);
    yield takeEvery('mvj/plotSearch/FETCH_CUSTOM_DETAILED_PLAN', fetchCustomDetailedPlanSaga);
    yield takeEvery('mvj/plotSearch/FETCH_CUSTOM_DETAILED_PLAN_ATTRIBUTES', fetchCustomDetailedPlanAttributesSaga);
    yield takeEvery('mvj/plotSearch/FETCH_FORM', fetchFormSaga);
    yield takeEvery('mvj/plotSearch/EDIT_FORM', editFormSaga);
    yield takeLatest('mvj/plotSearch/FETCH_PLOT_SEARCH_SUB_TYPES', fetchPlotSearchSubtypesSaga);
    yield takeLatest('mvj/plotSearch/FETCH_PLOT_SEARCH_STAGES', fetchStagesSaga);
    yield takeLatest('mvj/plotSearch/BATCH_CREATE_RESERVATION_IDENTIFIERS', batchCreateReservationIdentifiersSaga);
    yield takeLatest('mvj/plotSearch/FETCH_RESERVATION_IDENTIFIER_UNIT_LISTS', fetchReservationIdentifierUnitListsSaga);
    yield takeLatest('mvj/plotSearch/CREATE_DIRECT_RESERVATION_LINK', createDirectReservationLinkSaga);
    yield takeLatest('mvj/plotSearch/FETCH_RELATED_APPLICATIONS', fetchRelatedApplicationsSaga);
  })]);
}