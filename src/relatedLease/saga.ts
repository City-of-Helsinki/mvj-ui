import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { SubmissionError } from "redux-form";
import { receiveError } from "/src/api/actions";
import { fetchSingleLeaseAfterEdit } from "/src/leases/actions";
import { displayUIMessage } from "util/helpers";
import { createRelatedLease, createRelatedPlotApplication, deleteReleatedLease, deleteRelatedPlotApplication } from "./requests";

function* createReleatedLeaseSaga({
  payload,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson: bodyDelete
    } = yield call(createRelatedLease, payload);

    switch (statusCode) {
      case 201:
        yield put(fetchSingleLeaseAfterEdit({
          leaseId: payload.from_lease,
          callbackFunctions: [() => displayUIMessage({
            title: '',
            body: 'Vuokraustunnusten välinen liitos luotu'
          })]
        }));
        break;

      default:
        yield put(receiveError(new SubmissionError({ ...bodyDelete
        })));
        break;
    }
  } catch (error) {
    console.error('Failed to create related lease with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* deleteReleatedLeaseSaga({
  payload,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson: bodyDelete
    } = yield call(deleteReleatedLease, payload.id);

    switch (statusCode) {
      case 204:
        yield put(fetchSingleLeaseAfterEdit({
          leaseId: payload.leaseId,
          callbackFunctions: [() => displayUIMessage({
            title: '',
            body: 'Vuokraustunnusten välinen liitos poistettu'
          })]
        }));
        break;

      default:
        yield put(receiveError(new SubmissionError({ ...bodyDelete
        })));
        break;
    }
  } catch (error) {
    console.error('Failed to delete related lease with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* createRelatedPlotApplicationSaga({
  payload,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson: bodyDelete
    } = yield call(createRelatedPlotApplication, payload);

    switch (statusCode) {
      case 201:
        yield put(fetchSingleLeaseAfterEdit({
          leaseId: payload.lease,
          callbackFunctions: [() => displayUIMessage({
            title: '',
            body: 'Liitos luotu'
          })]
        }));
        break;

      default:
        yield put(receiveError(new SubmissionError({ ...bodyDelete
        })));
        break;
    }
  } catch (error) {
    console.error('Failed to delete related plot application with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* deleteRelatedPlotApplicationSaga({
  payload,
  type: string
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson: bodyDelete
    } = yield call(deleteRelatedPlotApplication, payload.id);

    switch (statusCode) {
      case 204:
        yield put(fetchSingleLeaseAfterEdit({
          leaseId: payload.leaseId,
          callbackFunctions: [() => displayUIMessage({
            title: '',
            body: 'Liitos poistettu'
          })]
        }));
        break;

      default:
        yield put(receiveError(new SubmissionError({ ...bodyDelete
        })));
        break;
    }
  } catch (error) {
    console.error('Failed to delete related plot application with error "%s"', error);
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/relatedLease/CREATE', createReleatedLeaseSaga);
    yield takeLatest('mvj/relatedLease/DELETE', deleteReleatedLeaseSaga);
    yield takeLatest('mvj/relatedLease/CREATE_PLOT_APPLICATION', createRelatedPlotApplicationSaga);
    yield takeLatest('mvj/relatedLease/DELETE_PLOT_APPLICATION', deleteRelatedPlotApplicationSaga);
  })]);
}