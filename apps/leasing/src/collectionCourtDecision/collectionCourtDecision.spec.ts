import { describe, expect, it } from "vitest";
import collectionCourtDecisionReducer, {
  initialState,
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
  fetchCollectionCourtDecisionsByLease,
  receiveCollectionCourtDecisionsByLease,
  notFoundByLease,
  uploadCollectionCourtDecision,
  deleteCollectionCourtDecision,
  hideCollectionCourtDecisionPanel,
  showCollectionCourtDecisionPanel,
  receiveIsSaveClicked,
} from "./slice";
import type { CollectionCourtDecisionState } from "./types";
const defaultState: CollectionCourtDecisionState = {
  attributes: null,
  byLease: {},
  isFetchingAttributes: false,
  isFetchingByLease: {},
  isPanelOpen: false,
  isSaveClicked: false,
  methods: null,
};

describe("collectionCourtDecision", () => {
  describe("Reducer", () => {
    describe("collectionCourtDecisionReducer", () => {
      it("should update isFetchingAttributes flag to true when fetching attributes", () => {
        const newState = { ...defaultState, isFetchingAttributes: true };
        const state = collectionCourtDecisionReducer(
          initialState,
          fetchAttributes(),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingAttributes flag to false by attributesNotFound", () => {
        const newState = { ...defaultState, isFetchingAttributes: false };
        let state = collectionCourtDecisionReducer(
          initialState,
          fetchAttributes(),
        );
        state = collectionCourtDecisionReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update attributes", () => {
        const dummyAttributes = {
          foo: "bar",
        };
        const newState = { ...defaultState, attributes: dummyAttributes };
        const state = collectionCourtDecisionReducer(
          initialState,
          receiveAttributes(dummyAttributes),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update methods", () => {
        const dummyMethods = {
          foo: "bar",
        };
        const newState = { ...defaultState, methods: dummyMethods };
        const state = collectionCourtDecisionReducer(
          initialState,
          receiveMethods(dummyMethods),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching collection court decisions", () => {
        const lease = 1;
        const newState = {
          ...defaultState,
          isFetchingByLease: {
            [lease]: true,
          },
        };
        const state = collectionCourtDecisionReducer(
          initialState,
          fetchCollectionCourtDecisionsByLease(lease),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update collection court decision list", () => {
        const lease = 1;
        const dummyCollectionCourtDecisions = [
          {
            id: 1,
            label: "Foo",
            name: "Bar",
          },
        ];
        const newState = {
          ...defaultState,
          isFetchingByLease: {
            [lease]: false,
          },
          byLease: {
            [lease]: dummyCollectionCourtDecisions,
          },
        };
        const state = collectionCourtDecisionReducer(
          initialState,
          receiveCollectionCourtDecisionsByLease({
            lease: lease,
            collectionCourtDecisions: dummyCollectionCourtDecisions,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to false by notFoundByLease", () => {
        const lease = 1;
        const newState = {
          ...defaultState,
          isFetchingByLease: {
            [lease]: false,
          },
        };
        const state = collectionCourtDecisionReducer(
          initialState,
          notFoundByLease(lease),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isPanelOpen flag to false", () => {
        const newState = { ...defaultState, isPanelOpen: false };
        let state = collectionCourtDecisionReducer(
          initialState,
          showCollectionCourtDecisionPanel(),
        );
        state = collectionCourtDecisionReducer(
          state,
          hideCollectionCourtDecisionPanel(),
        );
        expect(state).to.deep.equal(newState);
      });
      it("uploadCollectionCourtDecision should not change state", () => {
        const state = collectionCourtDecisionReducer(
          initialState,
          uploadCollectionCourtDecision({
            data: {
              decision_date: "foo",
              note: "foo",
              lease: 1,
            },
            file: {},
          }),
        );
        expect(state).to.deep.equal(defaultState);
      });
      it("deleteCollectionCourtDecision should not change state", () => {
        const state = collectionCourtDecisionReducer(
          initialState,
          deleteCollectionCourtDecision({
            id: 1,
            lease: 1,
          }),
        );
        expect(state).to.deep.equal(defaultState);
      });
      it("should update isPanelOpen flag to true", () => {
        const newState = { ...defaultState, isPanelOpen: true };
        const state = collectionCourtDecisionReducer(
          initialState,
          showCollectionCourtDecisionPanel(),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaveClicked", () => {
        const newState = { ...defaultState, isSaveClicked: true };
        const state = collectionCourtDecisionReducer(
          initialState,
          receiveIsSaveClicked(true),
        );
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
