// @flow

// Helper functions to select state
export function loggedInUser (state: Object) {
  return state.oidc.user;
}
