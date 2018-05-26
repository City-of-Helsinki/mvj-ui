import {expect} from 'chai';
import {
  receiveRentForPeriodByLease,
  fetchRentForPeriodByLease,
  notFound,
} from './actions';
import rentForPeriodReducer from './reducer';

describe('Rent for period', () => {

  describe('Reducer', () => {

    describe('rentForPeriodReducer', () => {

      it('should update rent for period list', () => {
        const leaseId = 1;
        const dummyRentForPeriod = [
          {
            id: 1,
            label: 'Foo',
          },
        ];

        const newState = {
          byLease: {[leaseId]: dummyRentForPeriod},
          isFetching: false,
        };

        const state = rentForPeriodReducer({}, receiveRentForPeriodByLease({leaseId: leaseId, rent: dummyRentForPeriod}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching rent for period', () => {
        const newState = {
          byLease: {},
          isFetching: true,
        };

        const state = rentForPeriodReducer({}, fetchRentForPeriodByLease());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {
          byLease: {},
          isFetching: false,
        };

        let state = rentForPeriodReducer({}, fetchRentForPeriodByLease());
        state = rentForPeriodReducer(state, notFound([]));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
