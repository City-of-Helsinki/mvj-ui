import { describe, expect, it } from "vitest";
import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
} from "./actions";
import createCollectionLetterReducer from "./reducer";
import type { CreateCollectionLetterState } from "./types";
const defaultState: CreateCollectionLetterState = {
  attributes: null,
  isFetchingAttributes: false,
};

describe("Create collection letter", () => {
  describe("Reducer", () => {
    describe("createCollectionLetterReducer", () => {
      it("should update isFetchingAttributes flag to true by fetchAttributes", () => {
        const newState = { ...defaultState, isFetchingAttributes: true };
        const state = createCollectionLetterReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingAttributes flag to true by attributesNotFound", () => {
        const newState = { ...defaultState, isFetchingAttributes: false };
        let state: Record<string, any> = createCollectionLetterReducer(
          {},
          fetchAttributes(),
        );
        state = createCollectionLetterReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update attributes", () => {
        const dummyAttributes = {
          foo: "bar",
        };
        const newState = { ...defaultState, attributes: dummyAttributes };
        const state = createCollectionLetterReducer(
          {},
          receiveAttributes(dummyAttributes),
        );
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
