import { describe, expect, it } from "vitest";
import areaNotesReducer, {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
  receiveAreaNoteList,
  receiveDeletedAreaNote,
  receiveEditedAreaNote,
  fetchAreaNoteList,
  createAreaNote,
  deleteAreaNote,
  editAreaNote,
  notFound,
  showEditMode,
  hideEditMode,
  initializeAreaNote,
  initialState,
} from "./slice";

describe("AreaNoteList", () => {
  describe("Reducer", () => {
    describe("areaNotesReducer", () => {
      it("should update attributes", () => {
        const dummyAttributes = {
          foo: "bar",
        };
        const newState = { ...initialState, attributes: dummyAttributes };
        const state = areaNotesReducer(
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
        const state = areaNotesReducer(
          initialState,
          receiveMethods(dummyMethods),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingAttributes flag to true by fetchAttributes", () => {
        const newState = { ...initialState, isFetchingAttributes: true };
        const state = areaNotesReducer(initialState, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingAttributes flag to false by attributesNotFound", () => {
        const newState = { ...initialState, isFetchingAttributes: false };
        let state = areaNotesReducer(initialState, fetchAttributes());
        state = areaNotesReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update area notes list", () => {
        const dummyAreaNotes = [
          {
            id: 1,
            label: "Foo",
          },
        ];
        const newState = { ...initialState, list: dummyAreaNotes };
        const state = areaNotesReducer(
          initialState,
          receiveAreaNoteList(dummyAreaNotes),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching area notes", () => {
        const newState = { ...initialState };
        newState.isFetching = true;
        const state = areaNotesReducer(initialState, fetchAreaNoteList({}));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when creating area note", () => {
        const newState = { ...initialState };
        newState.isFetching = true;
        const state = areaNotesReducer(initialState, createAreaNote({}));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to false when receiving created area note", () => {
        const dummyAreaNote = {
          id: 1,
          foo: "bar",
        };
        const editedAreaNote = {
          id: 1,
          foo: "barEdited",
        };
        const newState = {
          ...initialState,
          isFetching: false,
          list: [editedAreaNote],
        };
        let state = areaNotesReducer(
          initialState,
          createAreaNote(dummyAreaNote),
        );
        state = areaNotesReducer(state, receiveEditedAreaNote(dummyAreaNote));
        state = areaNotesReducer(state, receiveEditedAreaNote(editedAreaNote));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to false when receiving deleted area note", () => {
        const dummyAreaNote = {
          id: 1,
          foo: "bar",
        };
        const newState = { ...initialState };
        newState.isFetching = false;
        let state = areaNotesReducer(
          initialState,
          receiveEditedAreaNote(dummyAreaNote),
        );
        state = areaNotesReducer(state, receiveDeletedAreaNote(1));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when deleting area note", () => {
        const newState = { ...initialState };
        newState.isFetching = true;
        const state = areaNotesReducer(initialState, deleteAreaNote(1));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when editing area note", () => {
        const newState = { ...initialState };
        newState.isFetching = true;
        const state = areaNotesReducer(initialState, editAreaNote({}));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to false by notFound action", () => {
        const newState = { ...initialState };
        newState.isFetching = false;
        let state = areaNotesReducer(initialState, editAreaNote({}));
        state = areaNotesReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update isEditMode flag to true", () => {
        const newState = { ...initialState };
        newState.isEditMode = true;
        const state = areaNotesReducer(initialState, showEditMode());
        expect(state).to.deep.equal(newState);
      });
      it("should update isEditMode flag to false", () => {
        const newState = { ...initialState };
        newState.isFetching = false;
        let state = areaNotesReducer(initialState, showEditMode());
        state = areaNotesReducer(state, hideEditMode());
        expect(state).to.deep.equal(newState);
      });
      it("should update initial values", () => {
        const newState = { ...initialState };
        newState.initialValues = {};
        const state = areaNotesReducer(initialState, initializeAreaNote({}));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
