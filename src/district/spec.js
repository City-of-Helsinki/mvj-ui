import {expect} from 'chai';
import {
  fetchDistrictsByMunicipality,
  receiveDistrictsByMunicipality,
  notFound,
} from './actions';
import districtReducer from './reducer';

describe('Districts', () => {

  describe('Reducer', () => {

    describe('districtReducer', () => {

      it('should update districts received by municipality', () => {
        const dummyMunicipality = 1;
        const dummyDistricts = [
          {
            id: 1,
            label: 'Foo',
          },
        ];

        const newState = {
          byMunicipality: {1: dummyDistricts},
          isFetching: false,
        };

        const state = districtReducer({}, receiveDistrictsByMunicipality({municipality: dummyMunicipality, districts: dummyDistricts}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching districts', () => {
        const newState = {
          byMunicipality: {},
          isFetching: true,
        };

        const state = districtReducer({}, fetchDistrictsByMunicipality(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {
          byMunicipality: {},
          isFetching: false,
        };

        let state = districtReducer({}, fetchDistrictsByMunicipality(1));
        state = districtReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
