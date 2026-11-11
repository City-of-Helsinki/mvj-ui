import { describe, expect, it } from "vitest";
import {
  initialState,
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
  fetchCollectionNotesByLease,
  receiveCollectionNotesByLease,
  notFoundByLease,
  createCollectionNote,
  deleteCollectionNote,
  editCollectionNote,
} from "./slice";
import collectionNoteReducer from "./slice";

describe("collectionNote", () => {
  describe("Reducer", () => {
    describe("collectionNoteReducer", () => {
      it("should update isFetchingAttributes flag to true when fetching attributes", () => {
        const newState = { ...initialState, isFetchingAttributes: true };
        const state = collectionNoteReducer(initialState, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingAttributes flag to false by attributesNotFound", () => {
        const newState = { ...initialState, isFetchingAttributes: false };
        let state = collectionNoteReducer(initialState, fetchAttributes());
        state = collectionNoteReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update attributes", () => {
        const dummyAttributes = {
          foo: "bar",
        };
        const newState = { ...initialState, attributes: dummyAttributes };
        const state = collectionNoteReducer(
          initialState,
          receiveAttributes(dummyAttributes),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update methods", () => {
        const dummyMethods = {
          foo: "bar",
        };
        const newState = { ...initialState, methods: dummyMethods };
        const state = collectionNoteReducer(
          initialState,
          receiveMethods(dummyMethods),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching collection notes", () => {
        const lease = 1;
        const newState = { ...initialState };
        newState.isFetchingByLease = {
          [lease]: true,
        };
        const state = collectionNoteReducer(
          initialState,
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
        const newState = { ...initialState };
        newState.isFetchingByLease = {
          [lease]: false,
        };
        newState.byLease = {
          [lease]: dummyCollectionNotes,
        };
        const state = collectionNoteReducer(
          initialState,
          receiveCollectionNotesByLease({
            lease: lease,
            collectionNotes: dummyCollectionNotes,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to false by notFoundByLease", () => {
        const lease = 1;
        const newState = { ...initialState };
        newState.isFetchingByLease = {
          [lease]: false,
        };
        const state = collectionNoteReducer(
          initialState,
          notFoundByLease(lease),
        );
        expect(state).to.deep.equal(newState);
      });
      it("createCollectionNote should not change state", () => {
        const state = collectionNoteReducer(
          initialState,
          createCollectionNote({
            lease: 1,
            note: "foo",
          }),
        );
        expect(state).to.deep.equal(initialState);
      });
      it("deleteCollectionNote should not change state", () => {
        const state = collectionNoteReducer(
          initialState,
          deleteCollectionNote({
            id: 1,
            lease: 1,
          }),
        );
        expect(state).to.deep.equal(initialState);
      });
      it("editCollectionNote should not change state", () => {
        const state = collectionNoteReducer(
          initialState,
          editCollectionNote({
            id: 1,
            lease: 1,
            note: "foo",
          }),
        );
        expect(state).to.deep.equal(initialState);
      });
    });
  });
});
