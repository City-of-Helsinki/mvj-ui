import { expect } from "chai";
import { fetchDistrictsByMunicipality, receiveDistrictsByMunicipality, notFound } from "./actions";
import districtReducer from "./reducer";
import type { DistrictState } from "./types";
const defaultState: DistrictState = {
  byMunicipality: {},
  isFetching: false
};

describe('Districts', () => {
  describe('Reducer', () => {
    describe('districtReducer', () => {
      it('should update districts received by municipality', () => {
        const dummyMunicipality = 1;
        const dummyDistricts = [{
          id: 1,
          label: 'Foo'
        }];
        const newState = { ...defaultState,
          byMunicipality: {
            '1': dummyDistricts
          }
        };
        const state = districtReducer({}, receiveDistrictsByMunicipality({
          municipality: dummyMunicipality,
          districts: dummyDistricts
        }));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetching flag to true when fetching districts', () => {
        const newState = { ...defaultState,
          isFetching: true
        };
        const state = districtReducer({}, fetchDistrictsByMunicipality(1));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetching flag to false by notFound', () => {
        const newState = { ...defaultState,
          isFetching: false
        };
        let state: Record<string, any> = districtReducer({}, fetchDistrictsByMunicipality(1));
        state = districtReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});