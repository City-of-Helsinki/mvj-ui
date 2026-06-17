import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { receiveError } from "@/api/actions";
import {
  receiveTradeRegisterCompanyExtendedById,
  companyExtendedNotFoundById,
  receiveTradeRegisterCompanyNoticeById,
  companyNoticeNotFoundById,
  receiveTradeRegisterCompanyRepresentById,
  companyRepresentNotFoundById,
} from "./actions";
import {
  fetchCompanyExtended,
  fetchCompanyNotice,
  fetchCompanyRepresent,
  fetchRyytiStructuredTradeRegisterExtract,
  fetchRyytiNotifications,
} from "./requests";
import {
  mapRyytiNotificationsToCompanyNotice,
  mapRyytiStructuredExtractToCompanyExtended,
  mapRyytiStructuredExtractToCompanyNoticeFallback,
  mapRyytiStructuredExtractToCompanyRepresent,
} from "./mappers";
import { FLAG_TRADE_REGISTER_RYYTI } from "@/featureFlags";

type TradeRegisterFetchAction = {
  payload: string;
  type: string;
};

function* fetchCompanyExtendedByIdSagaLegacy({
  payload: businessId,
}: TradeRegisterFetchAction): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchCompanyExtended, businessId);

    switch (statusCode) {
      case 200:
        yield put(
          receiveTradeRegisterCompanyExtendedById({
            [businessId.toString()]:
              bodyAsJson.companyExtendedInfoResponseDetails,
          }),
        );
        break;

      default:
        console.error("Failed to fetch company extended info");
        yield put(companyExtendedNotFoundById(businessId));
        break;
    }
  } catch (error) {
    console.error(
      'Failed to fetch company extended info with error "%s"',
      error,
    );
    yield put(companyExtendedNotFoundById(businessId));
    yield put(receiveError(error));
  }
}

function* fetchRyytiCompanyExtendedByIdSaga({
  payload: businessId,
}: TradeRegisterFetchAction): Generator<any, any, any> {
  try {
    const {
      response: { status: structuredStatusCode },
      bodyAsJson: structuredBodyAsJson,
    } = yield call(fetchRyytiStructuredTradeRegisterExtract, businessId);

    if (structuredStatusCode === 200) {
      const mappedCompanyExtended = mapRyytiStructuredExtractToCompanyExtended(
        structuredBodyAsJson?.queryResult,
      );

      if (mappedCompanyExtended) {
        yield put(
          receiveTradeRegisterCompanyExtendedById({
            [businessId.toString()]: mappedCompanyExtended,
          }),
        );
        return;
      }
    }

    console.error("Failed to fetch company extended info");
    yield put(companyExtendedNotFoundById(businessId));
  } catch (error) {
    console.error(
      'Failed to fetch company extended info with error "%s"',
      error,
    );
    yield put(companyExtendedNotFoundById(businessId));
    yield put(receiveError(error));
  }
}

function* fetchCompanyNoticeByIdSagaLegacy({
  payload: businessId,
}: TradeRegisterFetchAction): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchCompanyNotice, businessId);

    switch (statusCode) {
      case 200:
        yield put(
          receiveTradeRegisterCompanyNoticeById({
            [businessId.toString()]:
              bodyAsJson.companyNoticeInfoResponseTypeDetails,
          }),
        );
        break;

      default:
        console.error("Failed to fetch company notice info");
        yield put(companyNoticeNotFoundById(businessId));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch company notice info with error "%s"', error);
    yield put(companyNoticeNotFoundById(businessId));
    yield put(receiveError(error));
  }
}

function* fetchRyytiCompanyNoticeByIdSaga({
  payload: businessId,
}: TradeRegisterFetchAction): Generator<any, any, any> {
  try {
    const {
      response: { status: notificationsStatusCode },
      bodyAsJson: notificationsBodyAsJson,
    } = yield call(fetchRyytiNotifications, businessId);

    if (notificationsStatusCode === 200) {
      const mappedCompanyNotice = mapRyytiNotificationsToCompanyNotice(
        notificationsBodyAsJson?.queryResult,
      );

      if (mappedCompanyNotice.notice.length) {
        yield put(
          receiveTradeRegisterCompanyNoticeById({
            [businessId.toString()]: mappedCompanyNotice,
          }),
        );
        return;
      }
    }

    const {
      response: { status: structuredStatusCode },
      bodyAsJson: structuredBodyAsJson,
    } = yield call(fetchRyytiStructuredTradeRegisterExtract, businessId);

    if (structuredStatusCode === 200) {
      const mappedFallbackNotice =
        mapRyytiStructuredExtractToCompanyNoticeFallback(
          structuredBodyAsJson?.queryResult,
        );

      yield put(
        receiveTradeRegisterCompanyNoticeById({
          [businessId.toString()]: mappedFallbackNotice,
        }),
      );
      return;
    }

    console.error("Failed to fetch company notice info");
    yield put(companyNoticeNotFoundById(businessId));
  } catch (error) {
    console.error('Failed to fetch company notice info with error "%s"', error);
    yield put(companyNoticeNotFoundById(businessId));
    yield put(receiveError(error));
  }
}

function* fetchCompanyRepresentByIdSagaLegacy({
  payload: businessId,
}: TradeRegisterFetchAction): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchCompanyRepresent, businessId);

    switch (statusCode) {
      case 200:
        yield put(
          receiveTradeRegisterCompanyRepresentById({
            [businessId.toString()]:
              bodyAsJson.companyRepresentInfoResponseTypeDetails,
          }),
        );
        break;

      default:
        console.error("Failed to fetch company represent info");
        yield put(companyRepresentNotFoundById(businessId));
        break;
    }
  } catch (error) {
    console.error(
      'Failed to fetch company represent info with error "%s"',
      error,
    );
    yield put(companyRepresentNotFoundById(businessId));
    yield put(receiveError(error));
  }
}

function* fetchRyytiCompanyRepresentByIdSaga({
  payload: businessId,
}: TradeRegisterFetchAction): Generator<any, any, any> {
  try {
    const {
      response: { status: structuredStatusCode },
      bodyAsJson: structuredBodyAsJson,
    } = yield call(fetchRyytiStructuredTradeRegisterExtract, businessId);

    if (structuredStatusCode === 200) {
      const mappedCompanyRepresent =
        mapRyytiStructuredExtractToCompanyRepresent(
          structuredBodyAsJson?.queryResult,
        );

      if (mappedCompanyRepresent) {
        yield put(
          receiveTradeRegisterCompanyRepresentById({
            [businessId.toString()]: mappedCompanyRepresent,
          }),
        );
        return;
      }
    }

    console.error("Failed to fetch company represent info");
    yield put(companyRepresentNotFoundById(businessId));
  } catch (error) {
    console.error(
      'Failed to fetch company represent info with error "%s"',
      error,
    );
    yield put(companyRepresentNotFoundById(businessId));
    yield put(receiveError(error));
  }
}

function* fetchCompanyExtendedByIdSaga(
  action: TradeRegisterFetchAction,
): Generator<any, any, any> {
  if (FLAG_TRADE_REGISTER_RYYTI) {
    yield* fetchRyytiCompanyExtendedByIdSaga(action);
    return;
  }

  yield* fetchCompanyExtendedByIdSagaLegacy(action);
}

function* fetchCompanyNoticeByIdSaga(
  action: TradeRegisterFetchAction,
): Generator<any, any, any> {
  if (FLAG_TRADE_REGISTER_RYYTI) {
    yield* fetchRyytiCompanyNoticeByIdSaga(action);
    return;
  }

  yield* fetchCompanyNoticeByIdSagaLegacy(action);
}

function* fetchCompanyRepresentByIdSaga(
  action: TradeRegisterFetchAction,
): Generator<any, any, any> {
  if (FLAG_TRADE_REGISTER_RYYTI) {
    yield* fetchRyytiCompanyRepresentByIdSaga(action);
    return;
  }

  yield* fetchCompanyRepresentByIdSagaLegacy(action);
}

export default function* (): Generator<any, any, any> {
  yield all([
    fork(function* (): Generator<any, any, any> {
      yield takeLatest(
        "mvj/tradeRegister/FETCH_COMPANY_EXTENDED_BY_ID",
        fetchCompanyExtendedByIdSaga,
      );
      yield takeLatest(
        "mvj/tradeRegister/FETCH_COMPANY_NOTICE_BY_ID",
        fetchCompanyNoticeByIdSaga,
      );
      yield takeLatest(
        "mvj/tradeRegister/FETCH_COMPANY_REPRESENT_BY_ID",
        fetchCompanyRepresentByIdSaga,
      );
    }),
  ]);
}
