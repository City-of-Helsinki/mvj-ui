//@flow

import {all, call, fork, put, takeLatest} from 'redux-saga/effects';
import {
  receiveError,
} from '$src/api/actions';
import {
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  receiveAreaSearchList,
  areaSearchesNotFound,
  areaSearchesByBBoxNotFound,
  receiveAreaSearchByBBoxList,
  receiveSingleAreaSearch,
  singleAreaSearchNotFound,
  listAttributesNotFound,
  receiveListAttributes,
  receiveListMethods,
  receiveAreaSearchInfoChecksBatchEditFailure,
  receiveAreaSearchInfoChecksBatchEditSuccess,
  hideEditMode, fetchSingleAreaSearch,
} from '$src/areaSearch/actions';
import {
  editSingleAreaSearchRequest,
  fetchAreaSearchAttributesRequest,
  fetchAreaSearchesRequest,
  fetchAreaSearchListAttributesRequest,
  fetchSingleAreaSearchRequest,
} from '$src/areaSearch/requests';
import {editApplicantInfoCheckItemRequest} from '$src/plotApplications/requests';
import {receiveUpdatedApplicantInfoCheckItem} from '$src/application/actions';
import {displayUIMessage} from '$util/helpers';

function* fetchListAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAreaSearchListAttributesRequest);

    switch (statusCode) {
      case 200:
        const attributes = {
          ...bodyAsJson.fields,
        };
        const methods = bodyAsJson.methods;

        yield put(receiveListAttributes(attributes));
        yield put(receiveListMethods(methods));
        break;
      default:
        yield put(listAttributesNotFound());
    }
  } catch (error) {
    console.error('Failed to fetch attributes with error "%s"', error);
    yield put(listAttributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAreaSearchAttributesRequest);

    switch (statusCode) {
      case 200:
        const attributes = {
          ...bodyAsJson.fields,
        };
        const methods = bodyAsJson.methods;

        yield put(receiveAttributes(attributes));
        yield put(receiveMethods(methods));
        break;
      default:
        yield put(attributesNotFound());
    }
  } catch (error) {
    console.error('Failed to fetch attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchAreaSearchListSaga({payload: query}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAreaSearchesRequest, query);

    switch(statusCode) {
      case 200:
        yield put(receiveAreaSearchList(bodyAsJson));
        break;
      default:
        yield put(areaSearchesNotFound());
    }
  } catch (error) {
    console.error('Failed to fetch area searches with error "%s"', error);
    yield put(areaSearchesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchAreaSearchesByBBoxSaga({payload: query}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAreaSearchesRequest, query);

    switch (statusCode) {
      case 200:
        yield put(receiveAreaSearchByBBoxList(bodyAsJson));
        break;
      case 404:
      case 500:
        yield put(areaSearchesByBBoxNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch area searches by bbox with error "%s"', error);
    yield put(areaSearchesByBBoxNotFound());
    yield put(receiveError(error));
  }
}

function* fetchCurrentAreaSearchSaga({payload: id}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSingleAreaSearchRequest, id);

    switch(statusCode) {
      case 200:
        yield put(receiveSingleAreaSearch(bodyAsJson));
        break;
      default:
        yield put(singleAreaSearchNotFound());
    }
  } catch (error) {
    console.error('Failed to fetch current area search with error "%s"', error);
    yield put(singleAreaSearchNotFound());
    yield put(receiveError(error));
  }
}

function* batchEditAreaSearchInfoChecksSaga({payload}): Generator<any, any, any> {
  const errors = {
    areaSearch: [],
    applicant: [],
  };

  yield all(payload.applicant.map((applicant) => call(function* ({id, kind, data}) {
    try {
      const {response: {status: statusCode}, bodyAsJson} = yield call(editApplicantInfoCheckItemRequest, data);

      switch (statusCode) {
        case 200:
        case 204:
          yield put(receiveUpdatedApplicantInfoCheckItem({
            id: data.id,
            data: bodyAsJson,
          }));
          break;
        default:
          console.error(bodyAsJson);
          console.log(kind);
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
  }, applicant)));

  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(
      editSingleAreaSearchRequest, payload.areaSearch.id, payload.areaSearch
    );

    switch (statusCode) {
      case 200:
      case 204:
        break;
      default:
        console.error(bodyAsJson);
        errors.areaSearch.push(bodyAsJson);
    }
  } catch (e) {
    console.error(e);
    errors.areaSearch.push(e);
  }

  const errorCount = errors.areaSearch.length + errors.applicant.length;
  if (errorCount === 0) {
    yield put(receiveAreaSearchInfoChecksBatchEditSuccess());
    yield put(fetchSingleAreaSearch(payload.areaSearch.id));
    yield put(hideEditMode());
    displayUIMessage({title: '', body: 'Käsittelytiedot päivitetty'});
  } else {
    yield put(receiveAreaSearchInfoChecksBatchEditFailure(errors));
    displayUIMessage({title: '', body: `${errorCount} käsittelytiedon päivitys epäonnistui!`}, {type: 'error'});
  }

}


export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/areaSearch/FETCH_LIST_ATTRIBUTES', fetchListAttributesSaga);
      yield takeLatest('mvj/areaSearch/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/areaSearch/FETCH_ALL', fetchAreaSearchListSaga);
      yield takeLatest('mvj/areaSearch/FETCH_ALL_BY_BBOX', fetchAreaSearchesByBBoxSaga);
      yield takeLatest('mvj/areaSearch/FETCH_SINGLE', fetchCurrentAreaSearchSaga);
      yield takeLatest('mvj/areaSearch/BATCH_EDIT_INFO_CHECKS', batchEditAreaSearchInfoChecksSaga);
    }),
  ]);
}
