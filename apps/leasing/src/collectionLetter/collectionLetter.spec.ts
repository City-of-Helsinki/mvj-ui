import { describe, expect, it } from "vitest";
import collectionLetterReducer, {
  initialState,
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
  fetchCollectionLettersByLease,
  receiveCollectionLettersByLease,
  notFoundByLease,
  uploadCollectionLetter,
  deleteCollectionLetter,
} from "./slice";

describe("collectionLetter", () => {
  describe("Reducer", () => {
    describe("collectionLetterReducer", () => {
      it("should update isFetchingAttributes flag to true when fetching attributes", () => {
        const newState = { ...initialState, isFetchingAttributes: true };
        const state = collectionLetterReducer(initialState, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingAttributes flag to false by attributesNotFound", () => {
        const newState = { ...initialState, isFetchingAttributes: false };
        let state = collectionLetterReducer(initialState, fetchAttributes());
        state = collectionLetterReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update attributes", () => {
        const dummyAttributes = {
          foo: "bar",
        };
        const newState = { ...initialState, attributes: dummyAttributes };
        const state = collectionLetterReducer(
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
        const state = collectionLetterReducer(
          initialState,
          receiveMethods(dummyMethods),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching collection letters", () => {
        const lease = 1;
        const newState = {
          ...initialState,
          isFetchingByLease: {
            [lease]: true,
          },
        };
        const state = collectionLetterReducer(
          initialState,
          fetchCollectionLettersByLease(lease),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update collection letter list", () => {
        const lease = 1;
        const dummyCollectionLetters = [
          {
            id: 1,
            label: "Foo",
            name: "Bar",
          },
        ];
        const newState = {
          ...initialState,
          isFetchingByLease: {
            [lease]: false,
          },
          byLease: {
            [lease]: dummyCollectionLetters,
          },
        };
        const state = collectionLetterReducer(
          initialState,
          receiveCollectionLettersByLease({
            lease: lease,
            collectionLetters: dummyCollectionLetters,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to false by notFoundByLease", () => {
        const lease = 1;
        const newState = {
          ...initialState,
          isFetchingByLease: {
            [lease]: false,
          },
        };
        const state = collectionLetterReducer(
          initialState,
          notFoundByLease(lease),
        );
        expect(state).to.deep.equal(newState);
      });
      it("uploadCollectionLetter should not change state", () => {
        const state = collectionLetterReducer(
          initialState,
          uploadCollectionLetter({
            data: {
              lease: 1,
            },
            file: {},
          }),
        );
        expect(state).to.deep.equal(initialState);
      });
      it("deleteCollectionLetter should not change state", () => {
        const state = collectionLetterReducer(
          initialState,
          deleteCollectionLetter({
            id: 1,
            lease: 1,
          }),
        );
        expect(state).to.deep.equal(initialState);
      });
    });
  });
});
