import { all, fork, put, takeLatest, call } from "redux-saga/effects";
import { push } from "react-router-redux";
import { SubmissionError } from "redux-form";
import { displayUIMessage, getSearchQuery, getUrlParams } from "util/helpers";
import { hideEditMode, receiveAttributes, receiveLandUseContractList, receiveSingleLandUseContract, notFound, receiveIsSaveClicked, attributesNotFound, receiveMethods, fetchSingleLandUseContractAfterEdit } from "./actions";
import { receiveError } from "/src/api/actions";
import { getRouteById, Routes } from "/src/root/routes";
import { createLandUseContract, fetchAttributes, fetchLandUseContracts, fetchSingleLandUseContract, editLandUseContract, deleteLandUseContract } from "./requests";

// import attributesMockData from './attributes-mock-data.json';
// import mockData from './mock-data.json';
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
    console.error('Failed to fetch attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchLandUseContractsSaga({
  payload: search,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchLandUseContracts, search);

    switch (statusCode) {
      case 200:
        yield put(receiveLandUseContractList(bodyAsJson));
        break;

      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch landUseContracts with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchSingleLandUseContractSaga({
  payload: contractId,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchSingleLandUseContract, contractId);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleLandUseContract(bodyAsJson));
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
    console.error('Failed to fetch leases with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* createLandUseContractSaga({
  payload: landUseContract,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(createLandUseContract, landUseContract);

    switch (statusCode) {
      case 201:
        yield put(push(`${getRouteById(Routes.LAND_USE_CONTRACTS)}/${bodyAsJson.id}`));
        yield put(receiveIsSaveClicked(false));
        displayUIMessage({
          title: '',
          body: 'Maankäyttösopimus luotu'
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
    console.error('Failed to create lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* editLandUseContractSaga({
  payload: landUseContract,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(editLandUseContract, landUseContract);

    switch (statusCode) {
      case 200:
        yield put(fetchSingleLandUseContractAfterEdit({
          id: landUseContract.id,
          callbackFunctions: [hideEditMode(), receiveIsSaveClicked(false), () => displayUIMessage({
            title: '',
            body: 'Maankäyttösopimus tallennettu'
          })]
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
    console.error('Failed to edit lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchSingleLandUseContractAfterEditSaga({
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
    } = yield call(fetchSingleLandUseContract, payload.id);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleLandUseContract(bodyAsJson));

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

function* deleteLandUseSaga({
  payload: id,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(deleteLandUseContract, id);

    switch (statusCode) {
      case 204:
        const query = getUrlParams(location.search);
        // Remove page specific url parameters when moving to landuse list page
        delete query.tab;
        yield put(push(`${getRouteById(Routes.LAND_USE_CONTRACTS)}/${getSearchQuery(query)}`));
        displayUIMessage({
          title: '',
          body: 'Maankäyttösopimus poistettu'
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

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/landUseContract/FETCH_ATTRIBUTES', fetchAttributesSaga);
    yield takeLatest('mvj/landUseContract/FETCH_ALL', fetchLandUseContractsSaga);
    yield takeLatest('mvj/landUseContract/FETCH_SINGLE', fetchSingleLandUseContractSaga);
    yield takeLatest('mvj/landUseContract/FETCH_SINGLE_AFTER_EDIT', fetchSingleLandUseContractAfterEditSaga);
    yield takeLatest('mvj/landUseContract/CREATE', createLandUseContractSaga);
    yield takeLatest('mvj/landUseContract/EDIT', editLandUseContractSaga);
    yield takeLatest('mvj/landUseContract/DELETE', deleteLandUseSaga);
  })]);
}