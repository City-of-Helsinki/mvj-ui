import { all, call, fork, put, select, takeLatest } from "redux-saga/effects";
import { SubmissionError } from "redux-form";
import { receiveError } from "@/api/slice";
import {
  fetchAttributes as fetchAttributesAction,
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  fetchCollectionCourtDecisionsByLease as fetchCollectionCourtDecisionsByLeaseAction,
  uploadCollectionCourtDecision as uploadCollectionCourtDecisionAction,
  deleteCollectionCourtDecision as deleteCollectionCourtDecisionAction,
  hideCollectionCourtDecisionPanel,
  receiveCollectionCourtDecisionsByLease,
  notFoundByLease,
  receiveIsSaveClicked,
} from "./slice";
import { displayUIMessage } from "@/util/helpers";
import {
  fetchAttributes,
  fetchCollectionCourtDecisionsByLease,
  uploadCollectionCourtDecision,
  deleteCollectionCourtDecision,
} from "./requests";
import { getCollectionCourtDecisionsByLease } from "./selectors";

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

function* fetchCollectionCourtDecisionsByLeaseSaga({
  payload: lease,
}: ReturnType<typeof fetchCollectionCourtDecisionsByLeaseAction>): Generator<
  any,
  any,
  any
> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchCollectionCourtDecisionsByLease, lease);

    switch (statusCode) {
      case 200:
        yield put(
          receiveCollectionCourtDecisionsByLease({
            lease: lease,
            collectionCourtDecisions: bodyAsJson.results,
          }),
        );
        break;

      default:
        yield put(notFoundByLease(lease));
        break;
    }
  } catch (error) {
    console.error(
      'Failed to fetch collection court decisoins by lease with error "%s"',
      error,
    );
    yield put(notFoundByLease(lease));
  }
}

function* uploadCollectionCourtDecisionSaga({
  payload,
}: ReturnType<typeof uploadCollectionCourtDecisionAction>): Generator<
  any,
  any,
  any
> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(uploadCollectionCourtDecision, payload);

    switch (statusCode) {
      case 201:
        yield put(
          fetchCollectionCourtDecisionsByLeaseAction(payload.data.lease),
        );
        yield put(hideCollectionCourtDecisionPanel());
        displayUIMessage({
          title: "",
          body: "Käräjäoikeuden päätös tallennettu",
        });
        break;

      default:
        yield put(receiveError(new SubmissionError({ ...bodyAsJson })));
        break;
    }
  } catch (error) {
    console.error(
      'Failed to upload collection court decision with error "%s"',
      error,
    );
    yield put(receiveError(error));
  } finally {
    yield put(receiveIsSaveClicked(false));
  }
}

function* deleteCollectionCourtDecisionSaga({
  payload,
}: ReturnType<typeof deleteCollectionCourtDecisionAction>): Generator<
  any,
  any,
  any
> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(deleteCollectionCourtDecision, payload.id);

    switch (statusCode) {
      case 204: {
        const currentDecisions = yield select(
          getCollectionCourtDecisionsByLease,
          payload.lease,
        );
        yield put(
          receiveCollectionCourtDecisionsByLease({
            lease: payload.lease,
            collectionCourtDecisions: currentDecisions.filter(
              (decision) => decision.id !== payload.id,
            ),
          }),
        );
        displayUIMessage({
          title: "",
          body: "Käräjäoikeuden päätös poistettu",
        });
        break;
      }

      default:
        yield put(receiveError(new SubmissionError({ ...bodyAsJson })));
        break;
    }
  } catch (error) {
    console.error(
      'Failed to delete collection court decision with error "%s"',
      error,
    );
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([
    fork(function* (): Generator<any, any, any> {
      yield takeLatest(fetchAttributesAction, fetchAttributesSaga);
      yield takeLatest(
        fetchCollectionCourtDecisionsByLeaseAction,
        fetchCollectionCourtDecisionsByLeaseSaga,
      );
      yield takeLatest(
        uploadCollectionCourtDecisionAction,
        uploadCollectionCourtDecisionSaga,
      );
      yield takeLatest(
        deleteCollectionCourtDecisionAction,
        deleteCollectionCourtDecisionSaga,
      );
    }),
  ]);
}
