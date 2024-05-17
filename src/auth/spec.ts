import { expect } from "chai";
import { clearApiToken, fetchApiToken, receiveApiToken, tokenNotFound } from "./actions";
import authReducer from "./reducer";
describe('Auth', () => {
  describe('Reducer', () => {
    describe('authReducer', () => {
      it('should update isFetching flag to true when fetching api token', () => {
        const newState = {
          apiToken: {},
          isFetching: true
        };
        const state = authReducer({}, fetchApiToken());
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetching flag to false by notFound', () => {
        const newState = {
          apiToken: {},
          isFetching: false
        };
        let state = authReducer({}, fetchApiToken());
        state = authReducer(state, tokenNotFound());
        expect(state).to.deep.equal(newState);
      });
      it('should update apiToken', () => {
        const dummyApiToken = {
          'foo': 'Lorem ipsum'
        };
        const newState = {
          apiToken: dummyApiToken,
          isFetching: false
        };
        const state = authReducer(state, receiveApiToken(dummyApiToken));
        expect(state).to.deep.equal(newState);
      });
      it('should clear apiToken', () => {
        const dummyApiToken = {
          'foo': 'Lorem ipsum'
        };
        const newState = {
          apiToken: {},
          isFetching: false
        };
        let state = authReducer({}, fetchApiToken());
        state = authReducer(state, receiveApiToken(dummyApiToken));
        state = authReducer(state, clearApiToken());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});