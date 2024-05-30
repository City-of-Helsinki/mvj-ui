import { expect } from "chai";
import { receiveError, clearError } from "./actions";
import apiReducer from "./reducer";
import type { ApiState } from "./types";
const defaultState: ApiState = {
  error: null
};

describe('API', () => {
  describe('Reducer', () => {
    describe('apiReducer', () => {
      it('should update error', () => {
        const dummyError = {
          'error': 'test'
        };
        const newState = { ...defaultState,
          error: dummyError
        };
        const state = apiReducer({}, receiveError(dummyError));
        expect(state).to.deep.equal(newState);
      });
      it('should clear error', () => {
        const dummyError = {
          'error': 'test'
        };
        const newState = { ...defaultState,
          error: null
        };
        let state = apiReducer({}, receiveError(dummyError));
        state = apiReducer(state, clearError());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});