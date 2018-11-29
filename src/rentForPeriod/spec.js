import {expect} from 'chai';
import {
  receiveRentForPeriodByLease,
  deleteRentForPeriodByLease,
  fetchRentForPeriodByLease,
  receiveIsSaveClicked,
  notFound,
} from './actions';
import rentForPeriodReducer from './reducer';

const defaultState = {
  byLease: {},
  isFetching: false,
  isSaveClicked: false,
};

describe('Rent for period', () => {

  describe('Reducer', () => {

    describe('rentForPeriodReducer', () => {

      it('should update rent for period list', () => {
        const leaseId = 1;
        const dummyRentForPeriod = {
          id: 1,
          label: 'Foo',
        };
        const newState = {...defaultState, byLease: {[leaseId]: [dummyRentForPeriod]}};

        const state = rentForPeriodReducer({}, receiveRentForPeriodByLease({leaseId: leaseId, rent: dummyRentForPeriod}));
        expect(state).to.deep.equal(newState);
      });

      it('should delete rent for period', () => {
        const leaseId = 1;
        const dummyRentForPeriod = {
          id: 1,
          label: 'Foo',
        };
        const newState = {...defaultState, byLease: {[leaseId]: []}};

        let state = rentForPeriodReducer({}, receiveRentForPeriodByLease({leaseId: leaseId, rent: dummyRentForPeriod}));
        state = rentForPeriodReducer(state, deleteRentForPeriodByLease({leaseId: leaseId, id: 1}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching rent for period', () => {
        const newState = {...defaultState, isFetching: true};

        const state = rentForPeriodReducer({}, fetchRentForPeriodByLease());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...defaultState, isFetching: false};

        let state = rentForPeriodReducer({}, fetchRentForPeriodByLease());
        state = rentForPeriodReducer(state, notFound([]));
        expect(state).to.deep.equal(newState);
      });

      it('should update isSaveClicked', () => {
        const newState = {...defaultState, isSaveClicked: true};

        const state = rentForPeriodReducer({}, receiveIsSaveClicked(true));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
