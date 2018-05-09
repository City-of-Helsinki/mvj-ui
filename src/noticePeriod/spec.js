import {expect} from 'chai';
import {
  receiveNoticePeriods,
  fetchNoticePeriods,
  notFound,
} from './actions';
import noticePeriodReducer from './reducer';

describe('Notice periods', () => {

  describe('Reducer', () => {

    describe('noticePeriodReducer', () => {

      it('should update notice period list', () => {
        const dummyNoticePeriods = [
          {
            id: 1,
            label: 'Foo',
          },
        ];

        const newState = {
          list: dummyNoticePeriods,
          isFetching: false,
        };

        const state = noticePeriodReducer({}, receiveNoticePeriods(dummyNoticePeriods));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching notice periods', () => {
        const newState = {
          list: [],
          isFetching: true,
        };

        const state = noticePeriodReducer({}, fetchNoticePeriods());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false when receiving notice periods', () => {
        const newState = {
          list: [],
          isFetching: false,
        };

        let state = noticePeriodReducer({}, fetchNoticePeriods());
        state = noticePeriodReducer(state, receiveNoticePeriods([]));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {
          list: [],
          isFetching: false,
        };

        let state = noticePeriodReducer({}, fetchNoticePeriods());
        state = noticePeriodReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
