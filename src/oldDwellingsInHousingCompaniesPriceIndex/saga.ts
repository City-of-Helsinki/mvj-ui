import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import {
  notFound,
  receiveOldDwellingsInHousingCompaniesPriceIndex,
} from "./actions";
import { fetchOldDwellingsInHousingCompaniesPriceIndex } from "./requests";
import { receiveError } from "@/api/actions";
import { FETCH_ACTION_STRING } from "./constants";

function* fetchOldDwellingsInHousingCompaniesPriceIndexSaga(): Generator<
  any,
  any,
  any
> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchOldDwellingsInHousingCompaniesPriceIndex);

    switch (statusCode) {
      case 200:
        yield put(receiveOldDwellingsInHousingCompaniesPriceIndex(bodyAsJson));
        break;

      default:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error(
      'Failed to fetch fetch old dwellings in housing companies price index with error "%s"',
      error,
    );
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([
    fork(function* (): Generator<any, any, any> {
      yield takeLatest(
        FETCH_ACTION_STRING,
        fetchOldDwellingsInHousingCompaniesPriceIndexSaga,
      );
    }),
  ]);
}
