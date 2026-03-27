import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { SubmissionError } from "redux-form";
import { receiveError } from "@/api/actions";
import { receiveContractFilesById, notFoundById } from "./actions";
import { fetchContractFiles } from "./requests";

function* fetchContractFilesByIdSaga({
  payload: id,
  type: any,
}): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchContractFiles, id);

    switch (statusCode) {
      case 200:
        yield put(
          receiveContractFilesById({
            contractId: id,
            files: bodyAsJson,
          }),
        );
        break;

      case 500:
        yield put(
          receiveContractFilesById({
            contractId: id,
            files: [],
          }),
        );
        break;

      default:
        yield put(notFoundById(id));
        yield put(receiveError(new SubmissionError({ ...bodyAsJson })));
        break;
    }
  } catch (error) {
    console.error(
      'Failed to fetch contract files by id with error "%s"',
      error,
    );
    yield put(notFoundById(id));
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([
    fork(function* (): Generator<any, any, any> {
      yield takeLatest(
        "mvj/contractFile/FETCH_BY_ID",
        fetchContractFilesByIdSaga,
      );
    }),
  ]);
}
