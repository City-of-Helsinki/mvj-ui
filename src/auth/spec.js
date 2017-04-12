import {expect} from 'chai';
import {receiveLogin} from './actions';
import {sessionReducer} from './reducer';

describe('Auth module', () => {

  describe('Reducer', () => {

    describe('sessionReducer', () => {

      it('should update state on receiving login', () => {
        const state = sessionReducer({}, receiveLogin({
          foo: 'bar',
        }));
        expect(state).to.have.property('foo', 'bar');
      });

    });

  });

});
