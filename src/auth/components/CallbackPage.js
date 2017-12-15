import React from 'react';
import PropTypes from 'prop-types';
import {CallbackComponent} from 'redux-oidc';

import userManager from '../util/user-manager';

class CallbackPage extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  // just redirect to '/' in both cases
  successCallback = () => {
    this.context.router.push('/');
  }

  render() {
    return (
      <CallbackComponent userManager={userManager} successCallback={this.successCallback} errorCallback={this.successCallback}><div></div></CallbackComponent>
    );
  }
}

export default CallbackPage;
