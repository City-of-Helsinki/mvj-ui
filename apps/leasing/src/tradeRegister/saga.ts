import {
  select,
  all,
  call,
  fork,
  put,
  takeLatest,
  delay,
} from "redux-saga/effects";
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
import {
  getCompanyExtendedById,
  getCompanyNoticeById,
  getCompanyRepresentById,
} from "./selectors";
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

function* fetchRyytiDataSaga({
  payload: businessId,
}: TradeRegisterFetchAction): Generator<any, any, any> {
  yield delay(0);

  const [extended, notice, represent] = yield all([
    select(getCompanyExtendedById, businessId),
    select(getCompanyNoticeById, businessId),
    select(getCompanyRepresentById, businessId),
  ]);

  if (extended !== undefined && notice !== undefined && represent !== undefined)
    return;

  try {
    const [notificationsResponse, structuredResponse] = yield all([
      call(fetchRyytiNotifications, businessId),
      call(fetchRyytiStructuredTradeRegisterExtract, businessId),
    ]);

    const {
      response: { status: notificationsStatusCode },
      bodyAsJson: notificationsBodyAsJson,
    } = notificationsResponse;

    const {
      response: { status: structuredStatusCode },
      bodyAsJson: structuredBodyAsJson,
    } = structuredResponse;

    const queryResult = structuredBodyAsJson?.queryResult;

    // 1. Handle Extended Info
    const mappedExtended =
      structuredStatusCode === 200
        ? mapRyytiStructuredExtractToCompanyExtended(queryResult)
        : null;

    if (mappedExtended) {
      yield put(
        receiveTradeRegisterCompanyExtendedById({
          [businessId]: mappedExtended,
        }),
      );
    } else {
      yield put(companyExtendedNotFoundById(businessId));
    }

    // 2. Handle Representatives
    const mappedRepresent =
      structuredStatusCode === 200
        ? mapRyytiStructuredExtractToCompanyRepresent(queryResult)
        : null;

    if (mappedRepresent) {
      yield put(
        receiveTradeRegisterCompanyRepresentById({
          [businessId]: mappedRepresent,
        }),
      );
    } else {
      yield put(companyRepresentNotFoundById(businessId));
    }

    // 3. Handle Notices (with fallback to structured extract)
    let mappedNotice = null;

    if (notificationsStatusCode === 200) {
      mappedNotice = mapRyytiNotificationsToCompanyNotice(
        notificationsBodyAsJson?.queryResult,
      );
    }

    if (!mappedNotice?.notice?.length && structuredStatusCode === 200) {
      mappedNotice =
        mapRyytiStructuredExtractToCompanyNoticeFallback(queryResult);
    }

    if (mappedNotice) {
      yield put(
        receiveTradeRegisterCompanyNoticeById({ [businessId]: mappedNotice }),
      );
    } else {
      yield put(companyNoticeNotFoundById(businessId));
    }
  } catch (error) {
    console.error('Failed to fetch Ryyti data with error "%s"', error);
    yield all([
      put(companyExtendedNotFoundById(businessId)),
      put(companyNoticeNotFoundById(businessId)),
      put(companyRepresentNotFoundById(businessId)),
      put(receiveError(error)),
    ]);
  }
}

export default function* (): Generator<any, any, any> {
  const RYYTI_ACTIONS = [
    "mvj/tradeRegister/FETCH_COMPANY_EXTENDED_BY_ID",
    "mvj/tradeRegister/FETCH_COMPANY_NOTICE_BY_ID",
    "mvj/tradeRegister/FETCH_COMPANY_REPRESENT_BY_ID",
  ];

  yield all([
    fork(function* (): Generator<any, any, any> {
      if (FLAG_TRADE_REGISTER_RYYTI) {
        yield takeLatest(RYYTI_ACTIONS, fetchRyytiDataSaga);
      } else {
        yield takeLatest(RYYTI_ACTIONS[0], fetchCompanyExtendedByIdSagaLegacy);
        yield takeLatest(RYYTI_ACTIONS[1], fetchCompanyNoticeByIdSagaLegacy);
        yield takeLatest(RYYTI_ACTIONS[2], fetchCompanyRepresentByIdSagaLegacy);
      }
    }),
  ]);
}
