import { describe, expect, it } from "vitest";
import {
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
  initializeRentBasis,
  showEditMode,
  hideEditMode,
  receiveFormValid,
  receiveIsSaveClicked,
} from "./actions";
import rentBasisReducer from "./reducer";
import type { RentBasisState } from "./types";
const defaultState: RentBasisState = {
  attributes: null,
  initialValues: {
    decisions: [{}],
    property_identifiers: [{}],
    rent_rates: [{}],
  },
  isEditMode: false,
  isFormValid: false,
  isFetching: false,
  isFetchingAttributes: false,
  isSaveClicked: false,
  isSaving: false,
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
        const state = rentBasisReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });
      it("should update methods", () => {
        const dummyMethods = {
          val1: "foo",
          val2: "bar",
        };
        const newState = { ...defaultState, methods: dummyMethods };
        const state = rentBasisReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingAttributes flag to true when fetching attributes", () => {
        const newState = { ...defaultState, isFetchingAttributes: true };
        const state = rentBasisReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingAttributes flag to false by attributesNotFound", () => {
        const newState = { ...defaultState, isFetchingAttributes: false };
        let state = rentBasisReducer({}, fetchAttributes());
        state = rentBasisReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching rent basis list", () => {
        const newState = { ...defaultState, isFetching: true };
        const state = rentBasisReducer({}, fetchRentBasisList({}));
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
          {},
          receiveRentBasisList({
            results: dummyRentBasisList,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching single rent basis", () => {
        const newState = { ...defaultState, isFetching: true };
        const state = rentBasisReducer({}, fetchSingleRentBasis(1));
        expect(state).to.deep.equal(newState);
      });
      it("should update single rent basis", () => {
        const dummyRentBasis = {
          val1: "foo",
          val2: "bar",
        };
        const newState = { ...defaultState, rentbasis: dummyRentBasis };
        const state = rentBasisReducer(
          {},
          receiveSingleRentBasis(dummyRentBasis),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true when creating new rent basis", () => {
        const newState = { ...defaultState, isSaving: true };
        const state = rentBasisReducer({}, createRentBasis({}));
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true when editing existing rent basis", () => {
        const newState = { ...defaultState, isSaving: true };
        const state = rentBasisReducer({}, editRentBasis({}));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to false by notFound", () => {
        const newState = { ...defaultState, isFetching: false };
        let state = rentBasisReducer({}, fetchRentBasisList({}));
        state = rentBasisReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update rent basis form initial values", () => {
        const dummyRentBasis = {
          val1: "foo",
          val2: "bar",
        };
        const newState = { ...defaultState, initialValues: dummyRentBasis };
        const state = rentBasisReducer({}, initializeRentBasis(dummyRentBasis));
        expect(state).to.deep.equal(newState);
      });
      it("should update isEditMode flag to true", () => {
        const newState = { ...defaultState, isEditMode: true };
        const state = rentBasisReducer({}, showEditMode());
        expect(state).to.deep.equal(newState);
      });
      it("should update isEditMode flag to false", () => {
        const newState = { ...defaultState, isEditMode: false };
        let state = rentBasisReducer({}, showEditMode());
        state = rentBasisReducer(state, hideEditMode());
        expect(state).to.deep.equal(newState);
      });
      it("should update isFormValid flag to true", () => {
        const newState = { ...defaultState, isFormValid: true };
        const state = rentBasisReducer({}, receiveFormValid(true));
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaveClicked flag to true", () => {
        const newState = { ...defaultState, isSaveClicked: true };
        const state = rentBasisReducer({}, receiveIsSaveClicked(true));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
