import {expect} from 'chai';
import {
  receiveError,
  clearError,
} from './actions';
import apiReducer from './reducer';

describe('Decisions', () => {

  describe('Reducer', () => {

    describe('decisionReducer', () => {
      it('should update error', () => {
        const dummyError = {'error': 'test'};
        const newState = {
          error: dummyError,
        };

        const state = apiReducer({}, receiveError(dummyError));
        expect(state).to.deep.equal(newState);
      });

      it('should clear error', () => {
        const dummyError = {'error': 'test'};
        const newState = {
          error: null,
        };

        let state = apiReducer({}, receiveError(dummyError));
        state = apiReducer(state, clearError());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
