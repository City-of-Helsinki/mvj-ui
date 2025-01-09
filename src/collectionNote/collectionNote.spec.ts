import { describe, expect, it } from "vitest";
import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
  fetchCollectionNotesByLease,
  receiveCollectionNotesByLease,
  notFoundByLease,
  createCollectionNote,
  deleteCollectionNote,
} from "./actions";
import collectionNoteReducer from "./reducer";
import type { CollectionNoteState } from "./types";
const defaultState: CollectionNoteState = {
  attributes: null,
  byLease: {},
  isFetchingAttributes: false,
  isFetchingByLease: {},
  methods: null,
};

describe("collectionNote", () => {
  describe("Reducer", () => {
    describe("collectionNoteReducer", () => {
      it("should update isFetchingAttributes flag to true when fetching attributes", () => {
        const newState = { ...defaultState, isFetchingAttributes: true };
        const state = collectionNoteReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingAttributes flag to false by attributesNotFound", () => {
        const newState = { ...defaultState, isFetchingAttributes: false };
        let state = collectionNoteReducer({}, fetchAttributes());
        state = collectionNoteReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update attributes", () => {
        const dummyAttributes = {
          foo: "bar",
        };
        const newState = { ...defaultState, attributes: dummyAttributes };
        const state = collectionNoteReducer(
          {},
          receiveAttributes(dummyAttributes),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update methods", () => {
        const dummyMethods = {
          foo: "bar",
        };
        const newState = { ...defaultState, methods: dummyMethods };
        const state = collectionNoteReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching collection notes", () => {
        const lease = 1;
        const newState = { ...defaultState };
        newState.isFetchingByLease = {
          [lease]: true,
        };
        const state = collectionNoteReducer(
          {},
          fetchCollectionNotesByLease(lease),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update collection note list", () => {
        const lease = 1;
        const dummyCollectionNotes = [
          {
            id: 1,
            label: "Foo",
            name: "Bar",
          },
        ];
        const newState = { ...defaultState };
        newState.isFetchingByLease = {
          [lease]: false,
        };
        newState.byLease = {
          [lease]: dummyCollectionNotes,
        };
        const state = collectionNoteReducer(
          {},
          receiveCollectionNotesByLease({
            lease: lease,
            collectionNotes: dummyCollectionNotes,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to false by notFoundByLease", () => {
        const lease = 1;
        const newState = { ...defaultState };
        newState.isFetchingByLease = {
          [lease]: false,
        };
        const state = collectionNoteReducer({}, notFoundByLease(lease));
        expect(state).to.deep.equal(newState);
      });
      it("createCollectionNote should not change state", () => {
        const state = collectionNoteReducer(
          {},
          createCollectionNote({
            lease: 1,
            note: "foo",
          }),
        );
        expect(state).to.deep.equal(defaultState);
      });
      it("deleteCollectionNote should not change state", () => {
        const state = collectionNoteReducer(
          {},
          deleteCollectionNote({
            id: 1,
            lease: 1,
          }),
        );
        expect(state).to.deep.equal(defaultState);
      });
    });
  });
});
