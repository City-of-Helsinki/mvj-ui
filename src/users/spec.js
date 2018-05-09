import {expect} from 'chai';
import {
  fetchUsers,
  receiveUsers,
  notFound,
} from './actions';
import usersReducer from './reducer';

describe('Users', () => {

  describe('Reducer', () => {

    describe('userReducer', () => {

      it('should update user list', () => {
        const dummyUsers = [
          {
            id: 1,
            name: 'User1',
          },
          {
            id: 2,
            name: 'User1',
          },
        ];

        const newState = {
          isFetching: false,
          list: dummyUsers,
        };

        const state = usersReducer({}, receiveUsers(dummyUsers));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching users', () => {
        const newState = {
          isFetching: true,
          list: [],
        };

        const state = usersReducer({}, fetchUsers(''));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false when received users', () => {
        const newState = {
          isFetching: false,
          list: [],
        };

        let state = usersReducer({}, fetchUsers(''));
        state = usersReducer(state, receiveUsers([]));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {
          isFetching: false,
          list: [],
        };

        let state = usersReducer({}, fetchUsers(''));
        state = usersReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
