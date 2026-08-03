import { describe, expect, it } from "vitest";
import rentBasisReducer, {
  receiveAttributes,
  receiveMethods,
  fetchAttributes,
  attributesNotFound,
  fetchRentBasisList,
  receiveRentBasisList,
  fetchSingleRentBasis,
  receiveSingleRentBasis,
  createRentBasis,
  editRentBasis,
  notFound,
  showEditMode,
  hideEditMode,
  receiveIsSaveClicked,
  receiveIsFormDirty,
} from "./slice";
import type { RentBasisState } from "./types";
const defaultState: RentBasisState = {
  attributes: null,
  isEditMode: false,
  isFetching: false,
  isFetchingAttributes: false,
  isSaveClicked: false,
  isSaving: false,
  isFormDirty: false,
  list: {},
  methods: null,
  rentbasis: {},
};

describe("Rent basis", () => {
  describe("Reducer", () => {
    describe("rentBasisReducer", () => {
      it("should update attributes", () => {
        const dummyAttributes = {
          val1: "foo",
          val2: "bar",
        };
        const newState = { ...defaultState, attributes: dummyAttributes };
        const state = rentBasisReducer(
          defaultState,
          receiveAttributes(dummyAttributes),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update methods", () => {
        const dummyMethods = {
          val1: "foo",
          val2: "bar",
        };
        const newState = { ...defaultState, methods: dummyMethods };
        const state = rentBasisReducer(
          defaultState,
          receiveMethods(dummyMethods),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingAttributes flag to true when fetching attributes", () => {
        const newState = { ...defaultState, isFetchingAttributes: true };
        const state = rentBasisReducer(defaultState, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingAttributes flag to false by attributesNotFound", () => {
        const newState = { ...defaultState, isFetchingAttributes: false };
        let state = rentBasisReducer(defaultState, fetchAttributes());
        state = rentBasisReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching rent basis list", () => {
        const newState = { ...defaultState, isFetching: true };
        const state = rentBasisReducer(defaultState, fetchRentBasisList({}));
        expect(state).to.deep.equal(newState);
      });
      it("should update rent basis list", () => {
        const dummyRentBasisList = [
          {
            id: 1,
            name: "foo",
          },
          {
            id: 2,
            name: "bar",
          },
        ];
        const newState = {
          ...defaultState,
          list: {
            results: dummyRentBasisList,
          },
        };
        const state = rentBasisReducer(
          defaultState,
          receiveRentBasisList({
            results: dummyRentBasisList,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching single rent basis", () => {
        const newState = { ...defaultState, isFetching: true };
        const state = rentBasisReducer(defaultState, fetchSingleRentBasis(1));
        expect(state).to.deep.equal(newState);
      });
      it("should update single rent basis", () => {
        const dummyRentBasis = {
          id: 1,
          name: "foo",
        };
        const newState = { ...defaultState, rentbasis: dummyRentBasis };
        const state = rentBasisReducer(
          defaultState,
          receiveSingleRentBasis(dummyRentBasis),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true when creating new rent basis", () => {
        const newState = { ...defaultState, isSaving: true };
        const state = rentBasisReducer(defaultState, createRentBasis({}));
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true when editing existing rent basis", () => {
        const newState = { ...defaultState, isSaving: true };
        const state = rentBasisReducer(defaultState, editRentBasis({}));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to false by notFound", () => {
        const newState = { ...defaultState, isFetching: false };
        let state = rentBasisReducer(defaultState, fetchRentBasisList({}));
        state = rentBasisReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update isEditMode flag to true", () => {
        const newState = { ...defaultState, isEditMode: true };
        const state = rentBasisReducer(defaultState, showEditMode());
        expect(state).to.deep.equal(newState);
      });
      it("should update isEditMode flag to false", () => {
        const newState = { ...defaultState, isEditMode: false };
        let state = rentBasisReducer(defaultState, showEditMode());
        state = rentBasisReducer(state, hideEditMode());
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaveClicked flag to true", () => {
        const newState = { ...defaultState, isSaveClicked: true };
        const state = rentBasisReducer(
          defaultState,
          receiveIsSaveClicked(true),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFormDirty flag to true", () => {
        const newState = { ...defaultState, isFormDirty: true };
        const state = rentBasisReducer(defaultState, receiveIsFormDirty(true));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
