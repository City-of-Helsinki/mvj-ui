import { expect } from "chai";
import { fetchAttributes, receiveAttributes, receiveMethods, attributesNotFound, fetchCommentsByLease, receiveCommentsByLease, createComment, editComment, notFound, clearEditFlags, showEditModeById, hideEditModeById, receiveIsSaveClicked } from "./actions";
import commentReducer from "./reducer";
import type { CommentState } from "./types";
const defaultState: CommentState = {
  attributes: null,
  byLease: {},
  isEditModeById: {},
  isFetching: false,
  isFetchingAttributes: false,
  isSaveClicked: false,
  methods: null
};
// @ts-expect-error
describe('Comments', () => {
  // $FlowFixMe
  describe('Reducer', () => {
    // $FlowFixMe
    describe('commentReducer', () => {
      // $FlowFixMe
      it('should update comment attributes', () => {
        const dummyAttributes = {
          val1: 1,
          val2: 'Foo',
          val3: 'Bar'
        };
        const newState = { ...defaultState,
          attributes: dummyAttributes
        };
        const state = commentReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });
      it('should update comment methods', () => {
        const dummyMethods = {
          PATCH: true,
          DELETE: true,
          GET: true,
          HEAD: true,
          POST: true,
          OPTIONS: true,
          PUT: true
        };
        const newState = { ...defaultState,
          methods: dummyMethods
        };
        const state = commentReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetchingAttributes flag to true when fetching attributes', () => {
        const newState = { ...defaultState,
          isFetchingAttributes: true
        };
        const state = commentReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = { ...defaultState,
          isFetchingAttributes: false
        };
        let state: Record<string, any> = commentReducer({}, fetchAttributes());
        state = commentReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });
      it('should update comment received by lease', () => {
        const dummyLease = 1;
        const dummyComments = {
          topic: 1,
          text: 'Foo'
        };
        const newState = { ...defaultState,
          byLease: {
            '1': dummyComments
          }
        };
        const state = commentReducer({}, receiveCommentsByLease({
          leaseId: dummyLease,
          comments: dummyComments
        }));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetching flag when fetching comments', () => {
        const newState = { ...defaultState,
          isFetching: true
        };
        const state = commentReducer({}, fetchCommentsByLease(1));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetching flag to when creating new comment', () => {
        const newState = { ...defaultState,
          isFetching: true
        };
        const state = commentReducer({}, createComment({}));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetching flag to when editing existing comment', () => {
        const newState = { ...defaultState,
          isFetching: true
        };
        const state = commentReducer({}, editComment({}));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetching flag to false by notFound', () => {
        const newState = { ...defaultState,
          isFetching: false
        };
        const state = commentReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });
      it('should update clear isEditModeById flags', () => {
        const leaseId = 0;
        const newState = { ...defaultState
        };
        let state: Record<string, any> = commentReducer({}, showEditModeById(leaseId));
        state = commentReducer(state, clearEditFlags());
        expect(state).to.deep.equal(newState);
      });
      it('should update isEditModeById flag to true by showEditModeById', () => {
        const leaseId = 0;
        const newState = { ...defaultState,
          isEditModeById: {
            [leaseId]: true
          }
        };
        const state = commentReducer({}, showEditModeById(leaseId));
        expect(state).to.deep.equal(newState);
      });
      it('should update isEditModeById flag to false by hideEditModeById', () => {
        const leaseId = 0;
        const newState = { ...defaultState,
          isEditModeById: {
            [leaseId]: false
          }
        };
        const state = commentReducer({}, hideEditModeById(leaseId));
        expect(state).to.deep.equal(newState);
      });
      it('should update isSaveClicked flag to true', () => {
        const newState = { ...defaultState,
          isSaveClicked: true
        };
        const state = commentReducer({}, receiveIsSaveClicked(true));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});