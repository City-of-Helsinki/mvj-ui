import {expect} from 'chai';
import {changeUser} from './actions';
import userReducer from './reducer';

const dummyUser = {
  id: 1,
  label: 'Foo',
  name: 'Bar',
};

describe('User (Role) module', () => {

  describe('Reducer', () => {

    describe('userReducer', () => {

      it('should update state on changing user', () => {
        const state = userReducer({}, changeUser(dummyUser));
        expect(state).to.deep.equal(dummyUser);
      });

    });

  });

});
