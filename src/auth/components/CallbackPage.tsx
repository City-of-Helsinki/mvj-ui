import React, { PureComponent } from "react";
import { withRouter } from "react-router";
import { CallbackComponent } from "redux-oidc";
import { getRedirectUrlFromSessionStorage } from "src/util/storage";
import userManager from "src/auth/util/user-manager";
import { getRouteById, Routes } from "src/root/routes";
type Props = {
  history: Record<string, any>;
};

class CallbackPage extends PureComponent<Props> {
  successCallback = () => {
    const {
      history
    } = this.props;
    history.push(getRedirectUrlFromSessionStorage() || getRouteById(Routes.LEASES));
  };

  render() {
    return <CallbackComponent errorCallback={this.successCallback} successCallback={this.successCallback} userManager={userManager}>
        <div></div>
      </CallbackComponent>;
  }

}

export default withRouter(CallbackPage);