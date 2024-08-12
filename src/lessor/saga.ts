import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { receiveLessors } from "./actions";
import { fetchContacts } from "@/contacts/requests";

function* fetchLessorsSaga({
  payload: params,
  type: any
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchContacts, { ...params,
      is_lessor: true
    });

    switch (statusCode) {
      case 200:
        yield put(receiveLessors(bodyAsJson.results));
        break;

      default:
        break;
    }
  } catch (error) {
    console.error('Failed to fetch lessors with error "%s"', error);
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/lessors/FETCH_ALL', fetchLessorsSaga);
  })]);
}