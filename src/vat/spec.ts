import { expect } from "chai";
import { receiveVats, fetchVats, notFound } from "./actions";
import vatsReducer from "./reducer";
import type { VatState } from "./types";
const defaultState: VatState = {
  isFetching: false,
  list: []
};

describe('Vats', () => {
  // $FlowFixMe
  describe('Reducer', () => {
    // $FlowFixMe
    describe('vatsReducer', () => {
      // $FlowFixMe
      it('should update vats', () => {
        const dummyVats = [{
          id: 1,
          label: 'Foo'
        }];
        const newState = { ...defaultState,
          list: dummyVats
        };
        const state = vatsReducer({}, receiveVats(dummyVats));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetching flag to true when fetching vats', () => {
        const newState = { ...defaultState,
          isFetching: true
        };
        const state = vatsReducer({}, fetchVats());
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetching flag to false by notFound', () => {
        const newState = { ...defaultState
        };
        let state = vatsReducer({}, fetchVats());
        state = vatsReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});