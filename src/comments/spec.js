import {expect} from 'chai';
import {
  receiveAttributes,
  fetchCommentsByLease,
  receiveCommentsByLease,
  createComment,
  editComment,
  notFound,
  showEditModeById,
  hideEditModeById,
} from './actions';
import commentReducer from './reducer';

const stateTemplate = {
  attributes: {},
  byLease: {},
  isEditModeById: {},
  isFetching: false,
};

describe('Comments', () => {

  describe('Reducer', () => {

    describe('commentReducer', () => {
      it('should update comment attributes', () => {
        const dummyAttributes = {
          val1: 1,
          val2: 'Foo',
          val3: 'Bar',
        };

        const newState = {...stateTemplate};
        newState.attributes = dummyAttributes;

        const state = commentReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update comment received by lease', () => {
        const dummyLease = 1;
        const dummyComments = {
          topic: 1,
          text: 'Foo',
        };

        const newState = {...stateTemplate};
        newState.byLease = {1: dummyComments};

        const state = commentReducer({}, receiveCommentsByLease({leaseId: dummyLease, comments: dummyComments}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag when fetching comments', () => {
        const newState = {...stateTemplate};
        newState.isFetching = true;

        const state = commentReducer({}, fetchCommentsByLease(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to when creating new comment', () => {
        const newState = {...stateTemplate};
        newState.isFetching = true;

        const state = commentReducer({}, createComment({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to when editing existing comment', () => {
        const newState = {...stateTemplate};
        newState.isFetching = true;

        const state = commentReducer({}, editComment({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...stateTemplate};
        newState.isFetching = false;

        const state = commentReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditModeById flag to true by showEditModeById', () => {
        const leaseId = 0;
        const newState = {...stateTemplate};
        newState.isEditModeById = {[leaseId]: true};

        const state = commentReducer({}, showEditModeById(leaseId));
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditModeById flag to false by hideEditModeById', () => {
        const leaseId = 0;
        const newState = {...stateTemplate};
        newState.isEditModeById = {[leaseId]: false};

        const state = commentReducer({}, hideEditModeById(leaseId));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
