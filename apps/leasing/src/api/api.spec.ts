import { describe, expect, it } from "vitest";
import apiReducer, { receiveError, clearError, initialState } from "./slice";

describe("API", () => {
  describe("Reducer", () => {
    describe("apiReducer", () => {
      it("should update error", () => {
        const dummyError = {
          error: "test",
        };
        const newState = { ...initialState, error: dummyError };
        const state = apiReducer(initialState, receiveError(dummyError));
        expect(state).to.deep.equal(newState);
      });
      it("should clear error", () => {
        const dummyError = {
          error: "test",
        };
        const newState = { ...initialState, error: null };
        let state = apiReducer(initialState, receiveError(dummyError));
        state = apiReducer(state, clearError());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
