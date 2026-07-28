import { describe, expect, it } from "vitest";
import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  fetchLeaseInvoicingConfirmationReportAttributes,
  leaseInvoicingConfirmationReportAttributesNotFound,
  receiveLeaseInvoicingConfirmationReportAttributes,
  fetchLeaseInvoicingConfrimationReports,
  notFoundLeaseInvoicingConfrimationReports,
  receiveLeaseInvoicingConfrimationReports,
  fetchReports,
  reportsNotFound,
  receiveReports,
  fetchReportData,
  receiveReportData,
  reportDataNotFound,
  setOptions,
  setPayload,
  sendReportToMail,
  noMailSent,
  mailSent,
  fetchOptions,
  receiveOptions,
  optionsNotFound,
} from "@/reports/actions";
import leaseReportsReducer from "@/reports/reducer";
import type { LeaseReportsState as LeaseReportsState } from "@/reports/types";
const defaultState: LeaseReportsState = {
  attributes: null,
  isFetchingAttributes: false,
  leaseInvoicingConfirmationReportAttributes: null,
  isFetchingLeaseInvoicingConfirmationReportAttributes: false,
  leaseInvoicingConfirmationReport: null,
  isFetchingLeaseInvoicingConfirmationReport: false,
  reports: null,
  isFetchingReports: false,
  reportData: null,
  isFetchingReportData: false,
  reportOptions: null,
  isSendingMail: false,
  options: null,
  isFetchingOptions: false,
  payload: null,
};

describe("Lease reports", () => {
  describe("Reducer", () => {
    it("should update isFetchingAttributes flag to true by fetchAttributes", () => {
      const newState = { ...defaultState, isFetchingAttributes: true };
      const state = leaseReportsReducer({}, fetchAttributes());
      expect(state).to.deep.equal(newState);
    });
    it("should update isFetchingAttributes flag to false by attributesNotFound", () => {
      const newState = { ...defaultState, isFetchingAttributes: false };
      let state: Record<string, any> = leaseReportsReducer(
        {},
        fetchAttributes(),
      );
      state = leaseReportsReducer(state, attributesNotFound());
      expect(state).to.deep.equal(newState);
    });
    it("should update attributes", () => {
      const dummyAttributes = {
        foo: "bar",
      };
      const newState = { ...defaultState, attributes: dummyAttributes };
      const state = leaseReportsReducer({}, receiveAttributes(dummyAttributes));
      expect(state).to.deep.equal(newState);
    });
    it("should update isFetchingLeaseInvoicingConfirmationReportAttributes flag to true by fetchLeaseInvoicingConfirmationReportAttributes", () => {
      const newState = {
        ...defaultState,
        isFetchingLeaseInvoicingConfirmationReportAttributes: true,
      };
      const state = leaseReportsReducer(
        {},
        fetchLeaseInvoicingConfirmationReportAttributes(),
      );
      expect(state).to.deep.equal(newState);
    });
    it("should update isFetchingLeaseInvoicingConfirmationReportAttributes flag to false by leaseInvoicingConfirmationReportAttributesNotFound", () => {
      const newState = {
        ...defaultState,
        isFetchingLeaseInvoicingConfirmationReportAttributes: false,
      };
      let state: Record<string, any> = leaseReportsReducer(
        {},
        fetchLeaseInvoicingConfirmationReportAttributes(),
      );
      state = leaseReportsReducer(
        state,
        leaseInvoicingConfirmationReportAttributesNotFound(),
      );
      expect(state).to.deep.equal(newState);
    });
    it("should update LeaseInvoicingConfirmationReport attributes", () => {
      const dummyAttributes = {
        foo: "bar",
      };
      const newState = {
        ...defaultState,
        leaseInvoicingConfirmationReportAttributes: dummyAttributes,
      };
      const state = leaseReportsReducer(
        {},
        receiveLeaseInvoicingConfirmationReportAttributes(dummyAttributes),
      );
      expect(state).to.deep.equal(newState);
    });
    it("should update isFetchingLeaseInvoicingConfirmationReport flag to true when fetching LeaseInvoicingConfirmationReport", () => {
      const newState = {
        ...defaultState,
        isFetchingLeaseInvoicingConfirmationReport: true,
      };
      const state = leaseReportsReducer(
        {},
        fetchLeaseInvoicingConfrimationReports({}),
      );
      expect(state).to.deep.equal(newState);
    });
    it("should update isFetchingLeaseInvoicingConfirmationReport flag to false by notFoundJobRuns", () => {
      const newState = {
        ...defaultState,
        isFetchingLeaseInvoicingConfirmationReport: false,
      };
      let state = leaseReportsReducer(
        {},
        fetchLeaseInvoicingConfrimationReports({}),
      );
      state = leaseReportsReducer(
        state,
        notFoundLeaseInvoicingConfrimationReports(),
      );
      expect(state).to.deep.equal(newState);
    });
    it("should update LeaseInvoicingConfirmationReport", () => {
      const dummyLeaseInvoicingConfirmationReport = {
        count: 0,
        next: null,
        previous: null,
        results: [],
      };
      const newState = {
        ...defaultState,
        isFetchingLeaseInvoicingConfirmationReport: false,
        leaseInvoicingConfirmationReport: dummyLeaseInvoicingConfirmationReport,
      };
      const state = leaseReportsReducer(
        {},
        receiveLeaseInvoicingConfrimationReports(
          dummyLeaseInvoicingConfirmationReport,
        ),
      );
      expect(state).to.deep.equal(newState);
    });
    it("should update isFetchingReports flag to true by fetchReports", () => {
      const newState = { ...defaultState, isFetchingReports: true };
      const state = leaseReportsReducer({}, fetchReports());
      expect(state).to.deep.equal(newState);
    });
    it("should update isFetchingReports flag to false by reportsNotFound", () => {
      const newState = { ...defaultState, isFetchingReports: false };
      let state: Record<string, any> = leaseReportsReducer({}, fetchReports());
      state = leaseReportsReducer(state, reportsNotFound());
      expect(state).to.deep.equal(newState);
    });
    it("should update reports", () => {
      const dummyReports = {
        foo: "bar",
      };
      const newState = { ...defaultState, reports: dummyReports };
      const state = leaseReportsReducer({}, receiveReports(dummyReports));
      expect(state).to.deep.equal(newState);
    });
    it("should update isFetchingReportData flag to true by fetchReportData", () => {
      const newState = { ...defaultState, isFetchingReportData: true };
      const state = leaseReportsReducer({}, fetchReportData({ test: "test" }));
      expect(state).to.deep.equal(newState);
    });
    it("should update isFetchingReportData flag to false by reportDataNotFound", () => {
      const newState = { ...defaultState, isFetchingReportData: false };
      let state: Record<string, any> = leaseReportsReducer(
        {},
        fetchReportData({ test: "test" }),
      );
      state = leaseReportsReducer(state, reportDataNotFound());
      expect(state).to.deep.equal(newState);
    });
    it("should update report data", () => {
      const dummyReports = {
        foo: "bar",
      };
      const newState = { ...defaultState, reportData: dummyReports };
      const state = leaseReportsReducer({}, receiveReportData(dummyReports));
      expect(state).to.deep.equal(newState);
    });
    it("should update reportOptions by setOptions", () => {
      const dummyReports = {
        foo: "bar",
      };
      const newState = { ...defaultState, reportOptions: dummyReports };
      const state = leaseReportsReducer({}, setOptions(dummyReports));
      expect(state).to.deep.equal(newState);
    });
    it("should update payload by setPayload", () => {
      const dummyPayload = {
        foo: "bar",
      };
      const newState = { ...defaultState, payload: dummyPayload };
      const state = leaseReportsReducer({}, setPayload(dummyPayload));
      expect(state).to.deep.equal(newState);
    });
    it("should update isSendingMail flag to true by sendReportToMail", () => {
      const newState = { ...defaultState, isSendingMail: true };
      const state = leaseReportsReducer({}, sendReportToMail({ test: "test" }));
      expect(state).to.deep.equal(newState);
    });
    it("should update isSendingMail flag to false by noMailSent", () => {
      const newState = { ...defaultState, isSendingMail: false };
      let state: Record<string, any> = leaseReportsReducer(
        {},
        sendReportToMail({ test: "test" }),
      );
      state = leaseReportsReducer(state, noMailSent());
      expect(state).to.deep.equal(newState);
    });
    it("should update isSendingMail flag to true by mailSent", () => {
      const newState = { ...defaultState, isSendingMail: false };
      const state = leaseReportsReducer({}, mailSent({ test: "test" }));
      expect(state).to.deep.equal(newState);
    });
    it("should update isFetchingOptions flag to true by fetchOptions", () => {
      const newState = { ...defaultState, isFetchingOptions: true };
      const state = leaseReportsReducer({}, fetchOptions("test"));
      expect(state).to.deep.equal(newState);
    });
    it("should update isFetchingOptions flag to false by optionsNotFound", () => {
      const newState = { ...defaultState, isFetchingOptions: false };
      let state: Record<string, any> = leaseReportsReducer(
        {},
        fetchOptions("test"),
      );
      state = leaseReportsReducer(state, optionsNotFound());
      expect(state).to.deep.equal(newState);
    });
    it("should update options", () => {
      const dummyOptions = {
        foo: "bar",
      };
      const newState = { ...defaultState, options: dummyOptions };
      const state = leaseReportsReducer({}, receiveOptions(dummyOptions));
      expect(state).to.deep.equal(newState);
    });
  });
});
