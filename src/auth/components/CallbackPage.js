import React from 'react';
import PropTypes from 'prop-types';
import {CallbackComponent} from 'redux-oidc';

import userManager from '../util/user-manager';

class CallbackPage extends React.Component {
  // just redirect to '/' in both cases
  errorCallback = () => {
    this.context.router.push('/');
  }
  successCallback = () => {
    this.context.router.push('/');
  }
  render() {

    return (
      <CallbackComponent userManager={userManager} successCallback={this.successCallback} errorCallback={this.errorCallback}>
        <div>
          Redirecting...
        </div>
      </CallbackComponent>
    );
  }
}

CallbackPage.contextTypes = {
  router: PropTypes.object,
};

export default CallbackPage;
