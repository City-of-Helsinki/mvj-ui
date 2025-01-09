import { describe, expect, it } from "vitest";
import {
  fetchTradeRegisterCompanyExtendedById,
  companyExtendedNotFoundById,
  receiveTradeRegisterCompanyExtendedById,
  fetchTradeRegisterCompanyNoticeById,
  companyNoticeNotFoundById,
  receiveTradeRegisterCompanyNoticeById,
  fetchTradeRegisterCompanyRepresentById,
  companyRepresentNotFoundById,
  receiveTradeRegisterCompanyRepresentById,
  receiveCollapseStates,
} from "./actions";
import tradeRegisterReducer from "./reducer";
import type { TradeRegisterState } from "./types";
const defaultState: TradeRegisterState = {
  collapseStates: {},
  companyExtendedById: {},
  companyNoticeById: {},
  companyRepresentById: {},
  isFetchingCompanyExtendedById: {},
  isFetchingCompanyNoticeById: {},
  isFetchingCompanyRepresentById: {},
};

describe("Trade register", () => {
  describe("Reducer", () => {
    describe("tradeRegisterReducer", () => {
      it("should update isFetchingCompanyExtendedById to true when fetching company extended info", () => {
        const dummyBusinessId = "123";
        const newState = {
          ...defaultState,
          isFetchingCompanyExtendedById: {
            [dummyBusinessId]: true,
          },
        };
        const state = tradeRegisterReducer(
          {},
          fetchTradeRegisterCompanyExtendedById(dummyBusinessId),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingCompanyExtendedById to false when by companyExtendednotFoundById", () => {
        const dummyBusinessId = "123";
        const newState = {
          ...defaultState,
          isFetchingCompanyExtendedById: {
            [dummyBusinessId]: false,
          },
        };
        let state = tradeRegisterReducer(
          {},
          fetchTradeRegisterCompanyExtendedById(dummyBusinessId),
        );
        state = tradeRegisterReducer(
          state,
          companyExtendedNotFoundById(dummyBusinessId),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update companyExtendedById", () => {
        const dummyBusinessId = "123";
        const dummyPayload = {
          [dummyBusinessId]: {
            foo: "bar",
          },
        };
        const newState = {
          ...defaultState,
          companyExtendedById: dummyPayload,
          isFetchingCompanyExtendedById: {
            [dummyBusinessId]: false,
          },
        };
        const state = tradeRegisterReducer(
          {},
          receiveTradeRegisterCompanyExtendedById(dummyPayload),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingCompanyNoticeById to true when fetching company notice info", () => {
        const dummyBusinessId = "123";
        const newState = {
          ...defaultState,
          isFetchingCompanyNoticeById: {
            [dummyBusinessId]: true,
          },
        };
        const state = tradeRegisterReducer(
          {},
          fetchTradeRegisterCompanyNoticeById(dummyBusinessId),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingCompanyNoticeById to false when by companyNoticenotFoundById", () => {
        const dummyBusinessId = "123";
        const newState = {
          ...defaultState,
          isFetchingCompanyNoticeById: {
            [dummyBusinessId]: false,
          },
        };
        let state = tradeRegisterReducer(
          {},
          fetchTradeRegisterCompanyNoticeById(dummyBusinessId),
        );
        state = tradeRegisterReducer(
          state,
          companyNoticeNotFoundById(dummyBusinessId),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update companyNoticeById", () => {
        const dummyBusinessId = "123";
        const dummyPayload = {
          [dummyBusinessId]: {
            foo: "bar",
          },
        };
        const newState = {
          ...defaultState,
          companyNoticeById: dummyPayload,
          isFetchingCompanyNoticeById: {
            [dummyBusinessId]: false,
          },
        };
        const state = tradeRegisterReducer(
          {},
          receiveTradeRegisterCompanyNoticeById(dummyPayload),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingCompanyRepresentById to true when fetching company represent info", () => {
        const dummyBusinessId = "123";
        const newState = {
          ...defaultState,
          isFetchingCompanyRepresentById: {
            [dummyBusinessId]: true,
          },
        };
        const state = tradeRegisterReducer(
          {},
          fetchTradeRegisterCompanyRepresentById(dummyBusinessId),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingCompanyRepresentById to false when by companyRepresentnotFoundById", () => {
        const dummyBusinessId = "123";
        const newState = {
          ...defaultState,
          isFetchingCompanyRepresentById: {
            [dummyBusinessId]: false,
          },
        };
        let state = tradeRegisterReducer(
          {},
          fetchTradeRegisterCompanyRepresentById(dummyBusinessId),
        );
        state = tradeRegisterReducer(
          state,
          companyRepresentNotFoundById(dummyBusinessId),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update companyRepresentById", () => {
        const dummyBusinessId = "123";
        const dummyPayload = {
          [dummyBusinessId]: {
            foo: "bar",
          },
        };
        const newState = {
          ...defaultState,
          companyRepresentById: dummyPayload,
          isFetchingCompanyRepresentById: {
            [dummyBusinessId]: false,
          },
        };
        const state = tradeRegisterReducer(
          {},
          receiveTradeRegisterCompanyRepresentById(dummyPayload),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update collapseStates", () => {
        const dummyPayload = {
          "123": false,
        };
        const newState = { ...defaultState, collapseStates: dummyPayload };
        const state = tradeRegisterReducer(
          {},
          receiveCollapseStates(dummyPayload),
        );
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
