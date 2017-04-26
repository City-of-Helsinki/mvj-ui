import {expect} from 'chai';
import {changeUser} from './actions';
import userReducer from './reducer';

describe('User (Role) module', () => {

  describe('Reducer', () => {

    describe('userReducer', () => {

      it('should update state on changing user', () => {
        const dummyUser = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {
          current: dummyUser,
          isFetching: false,
          list: [],
        };

        const state = userReducer({}, changeUser(dummyUser));
        expect(state).to.deep.equal(newState);
      });

    });

  });

});
