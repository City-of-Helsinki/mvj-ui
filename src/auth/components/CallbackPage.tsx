import React, { PureComponent } from "react";
import { withRouter } from "react-router";
import { CallbackComponent, CallbackComponentProps } from "redux-oidc";
import { getRedirectUrlFromSessionStorage } from "@/util/storage";
import userManager from "@/auth/util/user-manager";
import { getRouteById, Routes } from "@/root/routes";
type Props = {
  history: Record<string, any>;
};

const CallbackComponentWithChildren = ({ children, ...rest }: CallbackComponentProps & { children: React.ReactNode }): React.ReactNode => {
  return <CallbackComponent {...rest}>
        {children}
      </CallbackComponent>;
}

class CallbackPage extends PureComponent<Props> {
  successCallback = () => {
    const {
      history
    } = this.props;
    history.push(getRedirectUrlFromSessionStorage() || getRouteById(Routes.LEASES));
  };

  render() {
    return <CallbackComponentWithChildren errorCallback={this.successCallback} successCallback={this.successCallback} userManager={userManager}>
        <div></div>
      </CallbackComponentWithChildren>;
  }

}

export default withRouter(CallbackPage);