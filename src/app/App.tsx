import React, { useState, useEffect, useCallback } from "react";
import { connect, useDispatch } from "react-redux";
import ReduxToastr from "react-redux-toastr";
import { withRouter } from "react-router";
import flowRight from "lodash/flowRight";
import get from "lodash/get";
import { Sizes } from "@/foundation/enums";
import { revealContext } from "@/foundation/reveal";
import { ActionTypes, AppConsumer, AppProvider } from "@/app/AppContext";
import ApiErrorModal from "@/api/ApiErrorModal";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import Loader from "@/components/loader/Loader";
import LoginPage from "@/auth/components/LoginPage";
import SideMenu from "@/components/sideMenu/SideMenu";
import TopNavigation from "@/components/topNavigation/TopNavigation";
import { Routes, getRouteById } from "@/root/routes";
import { clearError } from "@/api/actions";
import { userFound, clearUser, receiveApiToken, clearApiToken } from "@/auth/actions";
import { getError } from "@/api/selectors";
import { getLoggedInUser } from "@/auth/selectors";
import { getLinkUrl, getPageTitle, getShowSearch } from "@/components/topNavigation/selectors";
import { getUserGroups, getUserActiveServiceUnit, getUserServiceUnits } from "@/usersPermissions/selectors";
import { setRedirectUrlToSessionStorage } from "@/util/storage";
import type { ApiError } from "@/api/types";
import type { UserGroups, UserServiceUnit, UserServiceUnits } from "@/usersPermissions/types";
import type { RootState } from "@/root/types";
import "@/main.scss";
import { useApiTokens, useOidcClient, useApiTokensClientTracking, isApiTokensUpdatedSignal, useAuthenticatedUser } from "hds-react";

const url = window.location.toString();
const IS_DEVELOPMENT_URL = url.includes('ninja') || url.includes('localhost');
type OwnProps = {
  children: JSX.Element;
};
type Props = OwnProps & {
  apiError: ApiError;
  clearError: typeof clearError;
  closeReveal: (...args: Array<any>) => any;
  history: Record<string, any>;
  linkUrl: string;
  location: Record<string, any>;
  pageTitle: string;
  userActiveServiceUnit: UserServiceUnit;
  userServiceUnits: UserServiceUnits;
  showSearch: boolean;
  user: Record<string, any>;
  userGroups: UserGroups;
};
type State = {
  displaySideMenu: boolean;
  loggedIn: boolean;
  displayUserGroups: boolean,
};

const App: React.FC<Props> = (props) => {
  const [loggedIn, setLoggedIn] = useState<State["loggedIn"]>(false);
  const [displaySideMenu, setDisplaySideMenu] = useState<State["displaySideMenu"]>(false);
  const [displayUserGroups, setDisplayUserGroups] = useState<State["displayUserGroups"]>(false);
  const { login, logout, getUser, isAuthenticated } = useOidcClient();
  const authenticatedUser = useAuthenticatedUser();
  const dispatch = useDispatch();
  const [apiTokensClientSignal, apiTokensClientSignalReset] = useApiTokensClientTracking();
  const { getStoredApiTokens, isRenewing } = useApiTokens();

  const setLoggedInIfApiTokenExists = useCallback(() => {
    // apiToken is required to make requests to the API, therefore we assume that user is "logged in" when they have a token
    const [_error, apiToken] = getStoredApiTokens();
      if (apiToken) {
        dispatch(receiveApiToken(apiToken));
        setLoggedIn(true);
      }
  }, [getStoredApiTokens, dispatch]);

  // Handle apiToken fetched or updated, e.g. after login
  useEffect(() => {
    // apiTokensClientSignal is a required dependency in order to pick up that apiToken was fetched
    if (isApiTokensUpdatedSignal(apiTokensClientSignal)) {
      setLoggedInIfApiTokenExists();
      apiTokensClientSignalReset();
    }
    return apiTokensClientSignalReset;
  }, [apiTokensClientSignal, getStoredApiTokens, dispatch]);

  // Handle apiToken already exists in session storage
  useEffect(() => {
    // isAuthenticated checks only that the user is authenticated, but apiToken is required to make requests to API
    if (isAuthenticated()) {
      dispatch(userFound(authenticatedUser));
      // Must ensure that apiToken exists before making any requests to API
      setLoggedInIfApiTokenExists();
    }
  }, [authenticatedUser, dispatch]);

  useEffect(() => {
    const {
      apiError,
    } = props;
    if (apiError) {
      return;
    }
  }, [props.apiError]);

  const handleLogin = () => {
    const { pathname, search } = props.location;
    setRedirectUrlToSessionStorage(`${pathname}${search}` || getRouteById(Routes.LEASES));
    login();
  };

  const logOut = () => {
    setLoggedIn(false);
    dispatch(clearUser());
    dispatch(clearApiToken());
    logout();
  };

  const toggleSideMenu = () => {
    setDisplaySideMenu(!displaySideMenu);
  };

  const toggleDisplayUserGroups = () => {
    setDisplayUserGroups(!displayUserGroups);
  };
  
  const handleDismissErrorModal = () => {
    props.closeReveal('apiError');
    props.clearError();
  };


  const {
    apiError,
    children,
    linkUrl,
    location,
    pageTitle,
    showSearch,
    userGroups,
    userActiveServiceUnit,
    userServiceUnits
  } = props;

  const user = getUser();
  const appStyle = IS_DEVELOPMENT_URL ? 'app-dev' : 'app';

  if (!loggedIn) {
    return <div className={appStyle}>
        <ReduxToastr newestOnTop={true} position="bottom-right" preventDuplicates={true} progressBar={false} timeOut={2000} transitionIn="fadeIn" transitionOut="fadeOut" closeOnToastrClick={true} />

        <ApiErrorModal data={apiError} isOpen={Boolean(apiError)} handleDismiss={handleDismissErrorModal} />

        <LoginPage buttonDisabled={Boolean(isRenewing())} onLoginClick={handleLogin} />
        <Loader isLoading={Boolean(isRenewing())} />

        {location.pathname === getRouteById(Routes.CALLBACK) && children}
      </div>;
  }

  return <AppProvider>
    <AppConsumer>
      {({
      isConfirmationModalOpen,
      confirmationFunction,
      confirmationModalButtonClassName,
      confirmationModalButtonText,
      confirmationModalLabel,
      confirmationModalTitle,
      dispatch
    }) => {
      const handleConfirmation = () => {
        confirmationFunction?.();
        handleHideConfirmationModal();
      };

      const handleHideConfirmationModal = () => {
        dispatch({
          type: ActionTypes.HIDE_CONFIRMATION_MODAL
        });
      };

      return <div className={appStyle}>
            <ApiErrorModal 
              size={Sizes.LARGE} 
              data={apiError} 
              isOpen={Boolean(apiError)} 
              handleDismiss={handleDismissErrorModal} 
            />

            <ConfirmationModal 
              confirmButtonClassName={confirmationModalButtonClassName} 
              confirmButtonLabel={confirmationModalButtonText} 
              isOpen={isConfirmationModalOpen} 
              label={confirmationModalLabel} 
              onCancel={handleHideConfirmationModal} 
              onClose={handleHideConfirmationModal} 
              onSave={handleConfirmation} 
              title={confirmationModalTitle || ''} 
            />

            <ReduxToastr 
              newestOnTop={true}
              position="bottom-right"
              preventDuplicates={true}
              progressBar={false}
              timeOut={2000}
              transitionIn="fadeIn"
              transitionOut="fadeOut"
              closeOnToastrClick={true}
            />

            <TopNavigation
              isMenuOpen={displaySideMenu}
              linkUrl={linkUrl}
              onLogout={logOut}
              pageTitle={pageTitle}
              showSearch={showSearch}
              toggleSideMenu={toggleSideMenu}
              toggleDisplayUserGroups={toggleDisplayUserGroups}
              username={get(user, 'profile.name')}
              userServiceUnits={userServiceUnits}
              userActiveServiceUnit={userActiveServiceUnit}
            />

            {displayUserGroups &&
              <section className="app__usergroup-list">
                <strong>Käyttäjäryhmät ja palvelukokonaisuudet</strong>
                {userGroups && userGroups.length > 1 &&
                  userGroups.map((group, index) => {
                    return (
                      <p className="usergroup-list-item" key={group}>
                        {group}
                      </p>
                    );
                  })}
              </section>
            }

            <section className="app__content">
              <SideMenu isOpen={displaySideMenu} onLinkClick={toggleSideMenu} />
              <div className='wrapper'>
                {children}
              </div>
            </section>
          </div>;
    }}
    </AppConsumer>
  </AppProvider>;
};

const mapStateToProps = (state: RootState) => {
  const user = getLoggedInUser(state);
  if (!user) {
    return {
      pageTitle: getPageTitle(state),
      showSearch: getShowSearch(state),
      user: null
    };
  }
  return {
    apiError: getError(state),
    linkUrl: getLinkUrl(state),
    pageTitle: getPageTitle(state),
    showSearch: getShowSearch(state),
    userGroups: getUserGroups(state),
    userServiceUnits: getUserServiceUnits(state),
    userActiveServiceUnit: getUserActiveServiceUnit(state)
  };
};

export default flowRight(withRouter, connect(mapStateToProps, {
  clearError,
}), revealContext())(App) as React.ComponentType<OwnProps>;