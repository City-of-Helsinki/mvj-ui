import { expect } from "chai";
import { fetchSapInvoices, receiveSapInvoices, notFound } from "./actions";
import sapInvoicesReducer from "./reducer";
import type { SapInvoicesState } from "./types";
const defaultState: SapInvoicesState = {
  isFetching: false,
  list: {}
};
// @ts-expect-error
describe('Sap invoices', () => {
  // $FlowFixMe
  describe('Reducer', () => {
    // $FlowFixMe
    describe('sapInvoicesReducer', () => {
      // $FlowFixMe
      it('should set isFetching flag to true when fetching sap invoices', () => {
        const newState = { ...defaultState,
          isFetching: true
        };
        const state = sapInvoicesReducer({}, fetchSapInvoices({}));
        expect(state).to.deep.equal(newState);
      });
      it('should set isFetching flag to false by notFound', () => {
        const newState = { ...defaultState,
          isFetching: false
        };
        let state = sapInvoicesReducer({}, fetchSapInvoices({}));
        state = sapInvoicesReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
      it('should update sap invoices', () => {
        const dummyList = {
          foo: 'bar'
        };
        const newState = { ...defaultState,
          list: dummyList
        };
        const state = sapInvoicesReducer({}, receiveSapInvoices(dummyList));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});