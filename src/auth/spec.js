import {expect} from 'chai';
import {
  fetchApiToken,
  receiveApiToken,
  tokenNotFound,
} from './actions';
import authReducer from './reducer';

describe('Auth', () => {

  describe('Reducer', () => {

    describe('invoiceReducer', () => {
      it('should update isFetching flag to true when fetching api token', () => {
        const newState = {
          apiToken: {},
          isFetching: true,
        };

        const state = authReducer({}, fetchApiToken());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {
          apiToken: {},
          isFetching: false,
        };

        const state = authReducer({}, tokenNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update apiToken', () => {
        const dummyApiToken = {'foo': 'Lorem ipsum'};
        const newState = {
          apiToken: dummyApiToken,
          isFetching: false,
        };

        const state = authReducer({}, receiveApiToken(dummyApiToken));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
