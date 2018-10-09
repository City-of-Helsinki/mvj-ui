// @flow
import {all, call, fork, put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import {push} from 'react-router-redux';
import {SubmissionError} from 'redux-form';

import {getRouteById} from '$src/root/routes';
import {
  fetchSingleLeaseWithoutLoader,
  hideArchiveAreaModal,
  hideEditMode,
  hideUnarchiveAreaModal,
  notFound,
  notFoundById,
  receiveAttributes,
  receiveIsSaveClicked,
  receiveLeases,
  receiveSingleLease,
  receiveLeaseById,
} from './actions';
import {receiveError} from '$src/api/actions';
import {fetchInvoicesByLease, receiveIsCreateInvoicePanelOpen} from '$src/invoices/actions';
import {fetchInvoiceSetsByLease} from '$src/invoiceSets/actions';
import {displayUIMessage} from '$src/util/helpers';
import {
  copyAreasToContract,
  createCharge,
  createLease,
  fetchAttributes,
  fetchLeases,
  fetchSingleLease,
  patchLease,
  createRelatedLease,
  deleteReleatedLease,
  startInvoicing,
  stopInvoicing,
  setRentInfoComplete,
  setRentInfoUncomplete,
} from './requests';
import {getCurrentLease} from './selectors';

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttributes);
    const attributes = bodyAsJson.fields;

    switch (statusCode) {
      case 200:
        yield put(receiveAttributes(attributes));
        break;
      case 404:
      case 500:
        break;
    }
  } catch (error) {
    console.error('Failed to fetch identifiers with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* fetchLeasesSaga({payload: search}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchLeases, search);

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

function* fetchSingleLeaseSaga({payload: id}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSingleLease, id);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleLease(bodyAsJson));
        break;
      case 404:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
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

function* fetchLeaseByIdSaga({payload: id}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSingleLease, id);

    switch (statusCode) {
      case 200:
        yield put(receiveLeaseById({leaseId: id, lease: bodyAsJson}));
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

function* createLeaseSaga({payload: lease}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(createLease, lease);

    switch (statusCode) {
      case 201:
        yield put(push(`${getRouteById('leases')}/${bodyAsJson.id}`));
        displayUIMessage({title: '', body: 'Vuokraus luotu'});
        break;
      case 400:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
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

function* patchLeaseSaga({payload: lease}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(patchLease, lease);

    switch (statusCode) {
      case 200:
        yield put(fetchSingleLeaseWithoutLoader(lease.id));
        yield put(receiveIsSaveClicked(false));
        yield put(hideEditMode());
        displayUIMessage({title: '', body: 'Vuokraus tallennettu'});
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
    console.error('Failed to edit lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* archiveLeaseAreaSaga({payload: lease}): Generator<any, any, any> {
  try {
    const id = lease.id;
    const {response: {status: statusCode}, bodyAsJson} = yield call(patchLease, lease);
    switch (statusCode) {
      case 200:
        yield put(fetchSingleLeaseWithoutLoader(id));
        yield put(hideArchiveAreaModal());
        displayUIMessage({title: '', body: 'Kohde arkistoitu'});
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
    console.error('Failed to edit lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* unarchiveLeaseAreaSaga({payload: lease}): Generator<any, any, any> {
  try {
    const id = lease.id;
    const {response: {status: statusCode}, bodyAsJson} = yield call(patchLease, lease);

    switch (statusCode) {
      case 200:
        yield put(fetchSingleLeaseWithoutLoader(id));
        yield put(hideUnarchiveAreaModal());
        displayUIMessage({title: '', body: 'Kohde poistettu arkistosta'});
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
    console.error('Failed to edit lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* startInvoicingSaga({payload: leaseId}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(startInvoicing, leaseId);

    switch (statusCode) {
      case 200:
        const currentLease = yield select(getCurrentLease);
        yield put(receiveSingleLease({...currentLease, is_invoicing_enabled: true}));
        displayUIMessage({title: '', body: 'Laskutus käynnistetty'});
        break;
      case 400:
        yield put(receiveError(new SubmissionError({_error: 'Server error 400', ...bodyAsJson})));
        break;
      case 500:
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to start invoicing with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* stopInvoicingSaga({payload: leaseId}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(stopInvoicing, leaseId);

    switch (statusCode) {
      case 200:
        const currentLease = yield select(getCurrentLease);
        yield put(receiveSingleLease({...currentLease, is_invoicing_enabled: false}));
        displayUIMessage({title: '', body: 'Laskutus keskeytetty'});
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
    console.error('Failed to stop invoicing with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* setRentInfoCompleteSaga({payload: leaseId}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(setRentInfoComplete, leaseId);

    switch (statusCode) {
      case 200:
        const currentLease = yield select(getCurrentLease);
        yield put(receiveSingleLease({...currentLease, is_rent_info_complete: true}));
        displayUIMessage({title: '', body: 'Vuokratiedot on merkattu olevan kunnossa'});
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
    console.error('Failed to set rent info complete with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* setRentInfoUncompleteSaga({payload: leaseId}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(setRentInfoUncomplete, leaseId);

    switch (statusCode) {
      case 200:
        const currentLease = yield select(getCurrentLease);
        yield put(receiveSingleLease({...currentLease, is_rent_info_complete: false}));
        displayUIMessage({title: '', body: 'Vuokratiedot on merkattu keskeneräisiksi'});
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
    console.error('Failed to set rent info complete with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* createReleatedLeaseSaga({payload}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson: bodyDelete} = yield call(createRelatedLease, payload);

    switch (statusCode) {
      case 201:
        yield put(fetchSingleLeaseWithoutLoader(payload.from_lease));
        displayUIMessage({title: '', body: 'Vuokratunnusten välinen liitos luotu'});
        break;
      default:
        yield put(receiveError(new SubmissionError({...bodyDelete})));
        break;
    }
  } catch (error) {
    console.error('Failed to create related lease with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* deleteReleatedLeaseSaga({payload}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson: bodyDelete} = yield call(deleteReleatedLease, payload.id);

    switch (statusCode) {
      case 204:
        yield put(fetchSingleLeaseWithoutLoader(payload.leaseId));
        displayUIMessage({title: '', body: 'Vuokratunnusten välinen liitos poistettu'});
        break;
      default:
        yield put(receiveError(new SubmissionError({...bodyDelete})));
        break;
    }
  } catch (error) {
    console.error('Failed to delete related lease with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* createChargeSaga({payload}): Generator<any, any, any> {
  try {
    const {leaseId} = payload;
    const {response: {status: statusCode}, bodyAsJson} = yield call(createCharge, payload);

    switch (statusCode) {
      case 201:
        yield put(fetchInvoicesByLease(leaseId));
        yield put(fetchInvoiceSetsByLease(leaseId));
        yield put(receiveIsCreateInvoicePanelOpen(false));
        displayUIMessage({title: '', body: 'Hyvityslasku luotu'});
        break;
      default:
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
    }
  } catch (error) {
    console.error('Failed to create charge with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* copyAreasToContractSaga({payload: leaseId}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson: bodyDelete} = yield call(copyAreasToContract, leaseId);

    switch (statusCode) {
      case 200:
        yield put(fetchSingleLeaseWithoutLoader(leaseId));
        displayUIMessage({title: '', body: 'Kopioitu sopimukseen'});
        break;
      default:
        yield put(receiveError(new SubmissionError({...bodyDelete})));
        break;
    }
  } catch (error) {
    console.error('Failed to delete related lease with error "%s"', error);
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/leases/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/leases/FETCH_ALL', fetchLeasesSaga);
      yield takeLatest('mvj/leases/FETCH_SINGLE', fetchSingleLeaseSaga);
      yield takeLatest('mvj/leases/FETCH_SINGLE_WITHOUT_LOADER', fetchSingleLeaseSaga);
      yield takeEvery('mvj/leases/FETCH_BY_ID', fetchLeaseByIdSaga);
      yield takeLatest('mvj/leases/CREATE', createLeaseSaga);
      yield takeLatest('mvj/leases/PATCH', patchLeaseSaga);
      yield takeLatest('mvj/leases/ARCHIVE_AREA', archiveLeaseAreaSaga);
      yield takeLatest('mvj/leases/UNARCHIVE_AREA', unarchiveLeaseAreaSaga);
      yield takeLatest('mvj/leases/START_INVOICING', startInvoicingSaga);
      yield takeLatest('mvj/leases/STOP_INVOICING', stopInvoicingSaga);
      yield takeLatest('mvj/leases/SET_RENT_INFO_COMPLETE', setRentInfoCompleteSaga),
      yield takeLatest('mvj/leases/SET_RENT_INFO_UNCOMPLETE', setRentInfoUncompleteSaga),
      yield takeLatest('mvj/leases/CREATE_CHARGE', createChargeSaga);
      yield takeLatest('mvj/leases/CREATE_RELATED_LEASE', createReleatedLeaseSaga);
      yield takeLatest('mvj/leases/DELETE_RELATED_LEASE', deleteReleatedLeaseSaga);
      yield takeLatest('mvj/leases/COPY_AREAS_TO_CONTRACT', copyAreasToContractSaga);
    }),
  ]);
}
