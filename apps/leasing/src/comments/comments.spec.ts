import { describe, expect, it } from "vitest";
import commentReducer, {
  initialState,
  fetchAttributes,
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  fetchCommentsByLease,
  receiveCommentsByLease,
  createComment,
  editComment,
  notFound,
  clearEditFlags,
  showEditModeById,
  hideEditModeById,
  receiveIsSaveClicked,
} from "./slice";

describe("Comments", () => {
  describe("Reducer", () => {
    describe("commentReducer", () => {
      it("should update comment attributes", () => {
        const dummyAttributes = {
          val1: 1,
          val2: "Foo",
          val3: "Bar",
        };
        const newState = { ...initialState, attributes: dummyAttributes };
        const state = commentReducer(
          initialState,
          receiveAttributes(dummyAttributes),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update comment methods", () => {
        const dummyMethods = {
          PATCH: true,
          DELETE: true,
          GET: true,
          HEAD: true,
          POST: true,
          OPTIONS: true,
          PUT: true,
        };
        const newState = { ...initialState, methods: dummyMethods };
        const state = commentReducer(initialState, fetchAttributes());
        const receivedState = commentReducer(
          state,
          receiveMethods(dummyMethods),
        );
        expect(receivedState).to.deep.equal(newState);
      });
      it("should update isFetchingAttributes flag to true when fetching attributes", () => {
        const newState = { ...initialState, isFetchingAttributes: true };
        const state = commentReducer(initialState, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingAttributes flag to false by attributesNotFound", () => {
        const newState = { ...initialState, isFetchingAttributes: false };
        let state = commentReducer(initialState, fetchAttributes());
        state = commentReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update comment received by lease", () => {
        const dummyLease = 1;
        const dummyComments = {
          topic: 1,
          text: "Foo",
        };
        const newState = {
          ...initialState,
          byLease: {
            "1": dummyComments,
          },
        };
        const state = commentReducer(
          initialState,
          receiveCommentsByLease({
            leaseId: dummyLease,
            comments: dummyComments,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag when fetching comments", () => {
        const newState = { ...initialState, isFetching: true };
        const state = commentReducer(initialState, fetchCommentsByLease(1));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to when creating new comment", () => {
        const newState = { ...initialState, isFetching: true };
        const state = commentReducer(
          initialState,
          createComment({ lease: 1, text: "Foo", topic: 1 }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to when editing existing comment", () => {
        const newState = { ...initialState, isFetching: true };
        const state = commentReducer(
          initialState,
          editComment({ id: 1, text: "Foo" }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to false by notFound", () => {
        const newState = { ...initialState, isFetching: false };
        const state = commentReducer(initialState, notFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update clear isEditModeById flags", () => {
        const leaseId = 0;
        const newState = { ...initialState };
        let state = commentReducer(initialState, showEditModeById(leaseId));
        state = commentReducer(state, clearEditFlags());
        expect(state).to.deep.equal(newState);
      });
      it("should update isEditModeById flag to true by showEditModeById", () => {
        const leaseId = 0;
        const newState = {
          ...initialState,
          isEditModeById: {
            [leaseId]: true,
          },
        };
        const state = commentReducer(initialState, showEditModeById(leaseId));
        expect(state).to.deep.equal(newState);
      });
      it("should update isEditModeById flag to false by hideEditModeById", () => {
        const leaseId = 0;
        const newState = {
          ...initialState,
          isEditModeById: {
            [leaseId]: false,
          },
        };
        const state = commentReducer(initialState, hideEditModeById(leaseId));
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaveClicked flag to true", () => {
        const newState = { ...initialState, isSaveClicked: true };
        const state = commentReducer(initialState, receiveIsSaveClicked(true));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
