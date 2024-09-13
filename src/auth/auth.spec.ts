import { describe, expect, it } from "vitest";
import { User } from "oidc-client-ts";
import { clearApiToken, receiveApiToken, userFound, clearUser } from "./actions";
import { authReducer, oidcReducer } from "./reducer";

const getMockUser = (): User => new User({
  id_token: "id123",
  session_state: "state",
  access_token: "access321",
  refresh_token: "refresh123",
  token_type: "id_token",
  scope: "openid profile",
  profile: {
    sub: "",
    iss: "",
    aud: "",
    exp: 1725539282918,
    iat: 1725539270573,
  },
  expires_at: 1725539282918,
  userState: "",
  url_state: "localhost:3000",
});

describe('Auth', () => {
  describe('Reducer', () => {
    describe('authReducer', () => {
      it('should update apiToken', () => {
        const dummyApiToken = {
          'foo': 'Lorem ipsum'
        };
        const newState = {
          apiToken: dummyApiToken,
        };
        const state = authReducer({}, receiveApiToken(dummyApiToken));
        expect(state).to.deep.equal(newState);
      });
      it('should clear apiToken', () => {
        const dummyApiToken = {
          'foo': 'Lorem ipsum'
        };
        const newState = {
          apiToken: {},
        };
        let state = authReducer({}, receiveApiToken(dummyApiToken));
        state = authReducer(state, clearApiToken());
        expect(state).to.deep.equal(newState);
      });
    });
    describe('oidcReducer', () => {
      it('should set user', () => {
        const mockUser = getMockUser();
        const mockState = Object.assign({}, {user: mockUser,});
        const state = oidcReducer({user: null}, userFound(mockUser));
        expect(state).to.deep.equal(mockState);
      });
    });
    it('should clear user', () => {
      const mockUser = getMockUser();
      const state = oidcReducer({user: mockUser}, clearUser());
      const nullUserState = {user: null};
      expect(state).to.deep.equal(nullUserState);
    });
  });
});
