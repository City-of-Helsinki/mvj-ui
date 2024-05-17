import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { receiveAttributes, receiveMethods, attributesNotFound, fetchLeaseholdTransferList as fetchLeaseholdTransferListAction, receiveLeaseholdTransferList, notFound } from "./actions";
import { receiveError } from "src/api/actions";
import { displayUIMessage } from "src/util/helpers";
import { deleteLeaseholdTransfer, fetchAttributes, fetchLeaseholdTransferList } from "./requests";

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
        const attributes = bodyAsJson.fields || null;
        const methods = bodyAsJson.methods || null;
        yield put(receiveAttributes(attributes));
        yield put(receiveMethods(methods));
        break;

      default:
        yield put(attributesNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch leasehold transfer attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchLeaseholdTransferListSaga({
  payload: query
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchLeaseholdTransferList, query);

    switch (statusCode) {
      case 200:
        yield put(receiveLeaseholdTransferList(bodyAsJson));
        break;

      default:
        console.error('Failed to fetch leasehold transfer list');
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch leasehold transfer list with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* deleteLeaseholdTransferAndupdateListSaga({
  payload: {
    id,
    searchQuery
  }
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(deleteLeaseholdTransfer, id);

    switch (statusCode) {
      case 204:
        yield put(fetchLeaseholdTransferListAction(searchQuery));
        displayUIMessage({
          title: '',
          body: 'Vuokraoikeuden siirto poistettu'
        });
        break;

      default:
        console.error('Failed to delete fetch leasehold transfer');
        yield put(receiveError(bodyAsJson));
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to delete leasehold transfer with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/leaseholdTransfer/FETCH_ATTRIBUTES', fetchAttributesSaga);
    yield takeLatest('mvj/leaseholdTransfer/FETCH_ALL', fetchLeaseholdTransferListSaga);
    yield takeLatest('mvj/leaseholdTransfer/DELETE_AND_UPDATE', deleteLeaseholdTransferAndupdateListSaga);
  })]);
}