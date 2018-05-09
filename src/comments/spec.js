import {expect} from 'chai';
import {
  receiveAttributes,
  fetchCommentsByLease,
  receiveCommentsByLease,
  createComment,
  editComment,
  notFound,
} from './actions';
import commentReducer from './reducer';

describe('Comments', () => {

  describe('Reducer', () => {

    describe('commentReducer', () => {
      it('should update comment attributes', () => {
        const dummyAttributes = {
          val1: 1,
          val2: 'Foo',
          val3: 'Bar',
        };

        const newState = {
          attributes: dummyAttributes,
          byLease: {},
          isFetching: false,
        };

        const state = commentReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update comment received by lease', () => {
        const dummyLease = 1;
        const dummyComments = {
          topic: 1,
          text: 'Foo',
        };

        const newState = {
          attributes: {},
          byLease: {1: dummyComments},
          isFetching: false,
        };

        const state = commentReducer({}, receiveCommentsByLease({leaseId: dummyLease, comments: dummyComments}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag fetching comments', () => {
        const newState = {
          attributes: {},
          byLease: {},
          isFetching: true,
        };

        const state = commentReducer({}, fetchCommentsByLease(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to when creating new comment', () => {
        const newState = {
          attributes: {},
          byLease: {},
          isFetching: true,
        };

        const state = commentReducer({}, createComment({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to when editing existing comment', () => {
        const newState = {
          attributes: {},
          byLease: {},
          isFetching: true,
        };

        const state = commentReducer({}, editComment({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {
          attributes: {},
          byLease: {},
          isFetching: false,
        };

        const state = commentReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
