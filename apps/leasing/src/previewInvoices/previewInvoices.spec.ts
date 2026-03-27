import { describe, expect, it } from "vitest";
import {
  fetchPreviewInvoices,
  receivePreviewInvoices,
  clearPreviewInvoices,
  notFound,
} from "./actions";
import previewInvoicesReducer from "./reducer";
import type { PreviewInvoicesState } from "./types";
const defaultState: PreviewInvoicesState = {
  isFetching: false,
  list: null,
};

describe("Preview invoices", () => {
  describe("Reducer", () => {
    describe("previewInvoicesReducer", () => {
      it("should clear preview invoices", () => {
        const dummyPreviewInvoices = [
          {
            id: 1,
            label: "Foo",
          },
        ];
        const newState = { ...defaultState };
        let state = previewInvoicesReducer(
          {},
          receivePreviewInvoices([dummyPreviewInvoices]),
        );
        state = previewInvoicesReducer(state, clearPreviewInvoices());
        expect(state).to.deep.equal(newState);
      });
      it("should update preview invoices", () => {
        const dummyPreviewInvoices = [
          {
            id: 1,
            label: "Foo",
          },
        ];
        const newState = { ...defaultState, list: [dummyPreviewInvoices] };
        const state = previewInvoicesReducer(
          {},
          receivePreviewInvoices([dummyPreviewInvoices]),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching preview invoices", () => {
        const newState = { ...defaultState, isFetching: true };
        const state = previewInvoicesReducer(
          {},
          fetchPreviewInvoices({
            lease: 1,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to false by notFound", () => {
        const newState = { ...defaultState, isFetching: false };
        let state = previewInvoicesReducer(
          {},
          fetchPreviewInvoices({
            lease: 1,
          }),
        );
        state = previewInvoicesReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
