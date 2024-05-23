import { expect } from "chai";
import { receiveAttributes, receiveMethods, fetchAttributes, attributesNotFound, fetchLeaseholdTransferList, receiveLeaseholdTransferList, deleteLeaseholdTransferAndUpdateList, notFound } from "./actions";
import leaseholdTransferReducer from "./reducer";
import type { LeaseholdTransferState } from "./types";
const defaultState: LeaseholdTransferState = {
  attributes: null,
  isFetching: false,
  isFetchingAttributes: false,
  list: {},
  methods: null
};

describe('Leasehold transfer', () => {
  describe('Reducer', () => {
    describe('leaseholdTransferReducer', () => {
      it('should update attributes', () => {
        const dummyAttributes = {
          val1: 'Foo',
          val2: 'Bar'
        };
        const newState = { ...defaultState,
          attributes: dummyAttributes
        };
        const state = leaseholdTransferReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });
      it('should update methods', () => {
        const dummyMethods = {
          val1: 'Foo',
          val2: 'Bar'
        };
        const newState = { ...defaultState,
          methods: dummyMethods
        };
        const state = leaseholdTransferReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });
      it('should set isFetchingAttributes flag to true when fetching attributes', () => {
        const newState = { ...defaultState,
          isFetchingAttributes: true
        };
        const state = leaseholdTransferReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });
      it('should set isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = { ...defaultState,
          isFetchingAttributes: false
        };
        let state = leaseholdTransferReducer({}, fetchAttributes());
        state = leaseholdTransferReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });
      it('should set isFetching flag to true when fetching leasehold transfer list', () => {
        const newState = { ...defaultState,
          isFetching: true
        };
        const state = leaseholdTransferReducer({}, fetchLeaseholdTransferList({}));
        expect(state).to.deep.equal(newState);
      });
      it('should set isFetching flag to true when deleting leasehold transfer', () => {
        const newState = { ...defaultState,
          isFetching: true
        };
        const state = leaseholdTransferReducer({}, deleteLeaseholdTransferAndUpdateList({
          id: 1,
          searchQuery: {}
        }));
        expect(state).to.deep.equal(newState);
      });
      it('should set isFetching flag to false by notFound', () => {
        const newState = { ...defaultState,
          isFetching: false
        };
        let state = leaseholdTransferReducer({}, fetchLeaseholdTransferList({}));
        state = leaseholdTransferReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
      it('should update leashold transfer list', () => {
        const dummyList = {
          foo: 'bar'
        };
        const newState = { ...defaultState,
          list: dummyList
        };
        const state = leaseholdTransferReducer({}, receiveLeaseholdTransferList(dummyList));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});