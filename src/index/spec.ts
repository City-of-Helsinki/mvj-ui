import { expect } from "chai";
import { fetchIndexList, receiveIndexList, notFound } from "./actions";
import indexReducer from "./reducer";
import type { IndexState } from "./types";
const defaultState: IndexState = {
  isFetching: false,
  list: []
};

describe('Index', () => {
  describe('Reducer', () => {
    describe('indexReducer', () => {
      it('should set isFetching flag to true when fetching index list', () => {
        const newState = { ...defaultState,
          isFetching: true
        };
        const state = indexReducer({}, fetchIndexList({}));
        expect(state).to.deep.equal(newState);
      });
      it('should update index list', () => {
        const dummyIndexList = [{
          foo: 'bar'
        }];
        const newState = { ...defaultState,
          list: dummyIndexList
        };
        const state = indexReducer({}, receiveIndexList(dummyIndexList));
        expect(state).to.deep.equal(newState);
      });
      it('should set isFetching flag to false by notFound', () => {
        const newState = { ...defaultState,
          isFetching: false
        };
        let state = indexReducer({}, fetchIndexList({}));
        state = indexReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});