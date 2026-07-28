import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Attributes, Reducer, Reports } from "@/types";
import type {
  ReceiveAttributesAction,
  ReceiveReportsAction,
  ReceiveReportDataAction,
  SetOptionsAction,
  SetPayloadAction,
  ReceiveOptionsAction,
} from "./types";
const isFetchingAttributesReducer: Reducer<boolean> = handleActions(
  {
    "mvj/reports/FETCH_ATTRIBUTES": () => true,
    "mvj/reports/RECEIVE_ATTRIBUTES": () => false,
    "mvj/reports/ATTRIBUTES_NOT_FOUND": () => false,
  },
  false,
);
const attributesReducer: Reducer<Attributes> = handleActions(
  {
    ["mvj/reports/RECEIVE_ATTRIBUTES"]: (
      state: Attributes,
      { payload: attributes }: ReceiveAttributesAction,
    ) => {
      return attributes;
    },
  },
  null,
);
const isFetchingReportsReducer: Reducer<boolean> = handleActions(
  {
    "mvj/reports/FETCH_REPORTS": () => true,
    "mvj/reports/RECEIVE_REPORTS": () => false,
    "mvj/reports/REPORTS_NOT_FOUND": () => false,
  },
  false,
);
const reportsReducer: Reducer<Attributes> = handleActions(
  {
    ["mvj/reports/RECEIVE_REPORTS"]: (
      state: Reports,
      { payload: reports }: ReceiveReportsAction,
    ) => {
      return reports;
    },
  },
  null,
);
const isFetchingReportDataReducer: Reducer<boolean> = handleActions(
  {
    "mvj/reports/FETCH_REPORT_DATA": () => true,
    "mvj/reports/RECEIVE_REPORT_DATA": () => false,
    "mvj/reports/REPORT_DATA_NOT_FOUND": () => false,
  },
  false,
);
const reportDataReducer: Reducer<Record<string, any>> = handleActions(
  {
    ["mvj/reports/RECEIVE_REPORT_DATA"]: (
      state: Reports,
      { payload: reportData }: ReceiveReportDataAction,
    ) => {
      return reportData;
    },
  },
  null,
);
const setOptionsReducer: Reducer<Record<string, any>> = handleActions(
  {
    // @ts-ignore: no overload mathces this call
    ["mvj/reports/SET_REPORT_OPTIONS"]: (
      state: Record<string, any>,
      { payload: options }: SetOptionsAction,
    ) => {
      return options;
    },
  },
  null,
);
const setPayloadReducer: Reducer<Record<string, any>> = handleActions(
  {
    // @ts-ignore: no overload mathces this call
    ["mvj/reports/SET_PAYLOAD"]: (
      state: Record<string, any>,
      { payload: payload }: SetPayloadAction,
    ) => {
      return payload;
    },
  },
  null,
);
const isSendingMailReducer: Reducer<boolean> = handleActions(
  {
    "mvj/reports/SEND_REPORT_TO_MAIL": () => true,
    "mvj/reports/NO_MAIL_SENT": () => false,
    "mvj/reports/MAIL_SENT": () => false,
  },
  false,
);
const isFetchingOptionsReducer: Reducer<boolean> = handleActions(
  {
    "mvj/reports/FETCH_OPTIONS": () => true,
    "mvj/reports/RECEIVE_OPTIONS": () => false,
    "mvj/reports/OPTIONS_NOT_FOUND": () => false,
  },
  false,
);
const optionsReducer: Reducer<Attributes> = handleActions(
  {
    // @ts-ignore: no overload mathces this call
    ["mvj/reports/RECEIVE_OPTIONS"]: (
      state: Record<string, any>,
      { payload: options }: ReceiveOptionsAction,
    ) => {
      return options;
    },
  },
  null,
);
export default combineReducers<Record<string, any>, any>({
  attributes: attributesReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  reports: reportsReducer,
  isFetchingReports: isFetchingReportsReducer,
  reportData: reportDataReducer,
  isFetchingReportData: isFetchingReportDataReducer,
  reportOptions: setOptionsReducer,
  payload: setPayloadReducer,
  isSendingMail: isSendingMailReducer,
  isFetchingOptions: isFetchingOptionsReducer,
  options: optionsReducer,
});
