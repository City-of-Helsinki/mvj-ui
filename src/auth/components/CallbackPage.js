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
      <CallbackComponent
        errorCallback={this.successCallback}
        successCallback={this.successCallback}
        userManager={userManager} >
        <div></div>
      </CallbackComponent>
    );
  }
}

export default CallbackPage;
