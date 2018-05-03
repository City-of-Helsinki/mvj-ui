import React from 'react';
import PropTypes from 'prop-types';
import {CallbackComponent} from 'redux-oidc';

import {getRedirectUrlFromSessionStorage} from '../helpers';
import userManager from '../util/user-manager';

class CallbackPage extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  successCallback = () => {
    const {router} = this.context;
    router.push(getRedirectUrlFromSessionStorage() || '/');
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
