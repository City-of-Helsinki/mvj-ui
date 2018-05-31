import {expect} from 'chai';
import {
  fetchInfillDevelopments,
  fetchSingleInfillDevelopment,
  notFound,
  receiveInfillDevelopments,
  receiveSingleInfillDevelopment,
} from './actions';
import infillDevelopmentReducer from './reducer';

describe('Infill development', () => {

  describe('Reducer', () => {

    describe('infillDevelopmentReducer', () => {

      it('should update infill development list', () => {
        const dummyInfillDevelopmentList = [
          {
            id: 1,
            label: 'Foo',
            name: 'Bar',
          },
          {
            id: 2,
            label: 'Foo',
            name: 'Bar',
          },
        ];

        const newState = {
          current: {},
          isFetching: false,
          list: dummyInfillDevelopmentList,
        };

        const state =infillDevelopmentReducer({}, receiveInfillDevelopments(dummyInfillDevelopmentList));
        expect(state).to.deep.equal(newState);
      });

      it('should update current infill development', () => {
        const dummyInfillDevelopment = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {
          current: dummyInfillDevelopment,
          isFetching: false,
          list: {},
        };

        const state =infillDevelopmentReducer({}, receiveSingleInfillDevelopment(dummyInfillDevelopment));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching infill developments', () => {
        const newState = {
          current: {},
          isFetching: true,
          list: {},
        };

        const state = infillDevelopmentReducer({}, fetchInfillDevelopments(''));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching single infill development', () => {
        const newState = {
          current: {},
          isFetching: true,
          list: {},
        };

        const state = infillDevelopmentReducer({}, fetchSingleInfillDevelopment(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {
          current: {},
          isFetching: false,
          list: {},
        };

        const state = infillDevelopmentReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
