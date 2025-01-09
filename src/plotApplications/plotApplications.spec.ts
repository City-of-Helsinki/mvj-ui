import { describe, expect, it } from "vitest";
import {
  fetchPlotApplicationsList,
  receivePlotApplicationsList,
  fetchSinglePlotApplication,
  receiveSinglePlotApplication,
  hideEditMode,
  showEditMode,
  receiveIsSaveClicked,
  receiveCollapseStates,
  receiveFormValidFlags,
  clearFormValidFlags,
  editPlotApplication,
} from "@/plotApplications/actions";
import plotApplicationReducer from "@/plotApplications/reducer";
import type { PlotApplicationsState } from "@/plotApplications/types";
const baseState: PlotApplicationsState = {
  currentEditorTargets: [],
  form: null,
  isFetching: false,
  isFetchingByBBox: false,
  isFetchingPlotSearch: false,
  listByBBox: null,
  isFetchingForm: false,
  isPerformingFileOperation: false,
  isSaving: false,
  isSaveClicked: false,
  isFetchingSubTypes: false,
  list: {},
  current: {},
  isEditMode: false,
  collapseStates: {},
  isFormValidById: {
    "plot-application": true,
  },
  subTypes: null,
  plotSearch: null,
  isFetchingTargetInfoCheckAttributes: false,
  targetInfoCheckAttributes: null,
  infoCheckBatchEditErrors: {
    applicant: [],
    target: [],
    openingRecord: null,
  },
  targetInfoChecksForCurrentPlotSearch: [],
  isFetchingTargetInfoChecksForCurrentPlotSearch: false,
  isSingleAllowed: true,
};

describe("PlotApplication", () => {
  describe("Reducer", () => {
    describe("plotApplicationReducer", () => {
      it("should update isFetching flag to true when fetching plotApplication list", () => {
        const newState = { ...baseState };
        newState.isFetching = true;
        const state = plotApplicationReducer({}, fetchPlotApplicationsList(""));
        expect(state).to.deep.equal(newState);
      });
      it("should update plotApplication list", () => {
        const dummyPlotApplicationsList = {
          id: 1,
          label: "Foo",
          name: "Bar",
        };
        const newState = { ...baseState };
        newState.list = dummyPlotApplicationsList;
        const state = plotApplicationReducer(
          {},
          receivePlotApplicationsList(dummyPlotApplicationsList),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching single plotApplication", () => {
        const newState = { ...baseState };
        newState.isFetching = true;
        const state = plotApplicationReducer({}, fetchSinglePlotApplication(1));
        expect(state).to.deep.equal(newState);
      });
      it("should update current plotApplication", () => {
        const dummyPlotApplication = {
          id: 1,
          label: "Foo",
          name: "Bar",
        };
        const newState = { ...baseState };
        newState.current = dummyPlotApplication;
        const state = plotApplicationReducer(
          {},
          receiveSinglePlotApplication(dummyPlotApplication),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isEditMode flag to false by hideEditMode", () => {
        const newState = { ...baseState };
        newState.isEditMode = false;
        const state = plotApplicationReducer({}, hideEditMode());
        expect(state).to.deep.equal(newState);
      });
      it("should update isEditMode flag to true by showEditMode", () => {
        const newState = { ...baseState };
        newState.isEditMode = true;
        const state = plotApplicationReducer({}, showEditMode());
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaveClicked", () => {
        const newState = { ...baseState };
        newState.isSaveClicked = true;
        const state = plotApplicationReducer({}, receiveIsSaveClicked(true));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFormValidById", () => {
        const newState = { ...baseState };
        const flags = { ...newState.isFormValidById };
        flags["plot-application"] = false;
        newState.isFormValidById = flags;
        const state = plotApplicationReducer(
          {},
          receiveFormValidFlags({
            ["plot-application"]: false,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should clear isFormValidById", () => {
        const newState = { ...baseState };
        let state = plotApplicationReducer(
          {},
          receiveFormValidFlags({
            ["plot-application"]: false,
          }),
        );
        state = plotApplicationReducer(state, clearFormValidFlags());
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching and isSaving flags to true by editPlotApplication", () => {
        const newState = { ...baseState };
        newState.isFetching = true;
        newState.isSaving = true;
        const state = plotApplicationReducer({}, editPlotApplication({}));
        expect(state).to.deep.equal(newState);
      });
      it("should update collapseStates", () => {
        const newState = {
          ...baseState,
          collapseStates: {
            foo: "bar",
            foo2: "bar2",
          },
        };
        let state = plotApplicationReducer(
          {},
          receiveCollapseStates({
            foo: "bar",
          }),
        );
        state = plotApplicationReducer(
          state,
          receiveCollapseStates({
            foo2: "bar2",
          }),
        );
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
