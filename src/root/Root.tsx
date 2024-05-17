import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { OidcProvider } from "redux-oidc";
import userManager from "../auth/util/user-manager";
import routes from "./routes";
export type RootProps = {
  history: any;
  store: any;
};

const Root = ({
  history,
  store
}: RootProps) => <Provider store={store}>
    <OidcProvider store={store} userManager={userManager}>
      <ConnectedRouter history={history}>
        {routes}
      </ConnectedRouter>
    </OidcProvider>
  </Provider>;

export default Root;