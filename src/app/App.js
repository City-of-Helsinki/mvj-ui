// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import {Sizes} from '../foundation/enums';
import {revealContext} from '../foundation/reveal';

import {ActionTypes, AppConsumer, AppProvider} from './AppContext';
import ApiErrorModal from '../api/ApiErrorModal';
import ConfirmationModal from '$src/components/modal/ConfirmationModal';
import Loader from '$components/loader/Loader';
import LoginPage from '../auth/components/LoginPage';
import SideMenu from '$components/sideMenu/SideMenu';
import TopNavigation from '$components/topNavigation/TopNavigation';
import userManager from '../auth/util/user-manager';
import {Routes, getRouteById} from '../root/routes';
import {clearError} from '../api/actions';
import {clearApiToken, fetchApiToken} from '../auth/actions';
import {getEpochTime} from '$util/helpers';
import {getError} from '../api/selectors';
import {getApiToken, getApiTokenExpires, getIsFetching, getLoggedInUser} from '../auth/selectors';
import {getLinkUrl, getPageTitle, getShowSearch} from '$components/topNavigation/selectors';
import {getUserGroups} from '$src/usersPermissions/selectors';
import {setRedirectUrlToSessionStorage} from '$util/storage';

import type {ApiError} from '../api/types';
import type {ApiToken} from '../auth/types';
import type {UserGroups} from '$src/usersPermissions/types';
import type {RootState} from '../root/types';

const url = window.location.toString();
const IS_DEVELOPMENT_URL = url.includes('ninja') || url.includes('localhost');

type Props = {
  apiError: ApiError,
  apiToken: ApiToken,
  apiTokenExpires: number,
  children: any,
  clearApiToken: Function,
  clearError: typeof clearError,
  closeReveal: Function,
  fetchApiToken: Function,
  history: Object,
  isApiTokenFetching: boolean,
  linkUrl: string,
  location: Object,
  pageTitle: string,
  showSearch: boolean,
  user: Object,
  userGroups: UserGroups,
};

type State = {
  displaySideMenu: boolean,
  loggedIn: boolean,
};

class App extends Component<Props, State> {
  state = {
    displaySideMenu: false,
    loggedIn: false,
  }

  timerID: any

  componentWillUnmount() {
    this.stopApiTokenTimer();
  }

  startApiTokenTimer = () => {
    this.timerID = setInterval(
      () => this.checkApiToken(),
      5000
    );
  }

  stopApiTokenTimer = () => {
    clearInterval(this.timerID);
  }

  componentDidUpdate(prevProps: Props) {
    const {
      apiError,
      apiToken,
      clearApiToken,
      fetchApiToken,
      history,
      isApiTokenFetching,
      user,
    } = this.props;
    const {loggedIn} = this.state;

    if(apiError) {
      return;
    }

    // Fetch api token if user info is received but Api token is empty
    if(!isApiTokenFetching &&
      user &&
      user.access_token &&
      (isEmpty(apiToken) || user.access_token !== get(prevProps, 'user.access_token'))
    ) {
      fetchApiToken(user.access_token);
      this.startApiTokenTimer();
      return;
    }

    if(apiToken && !prevProps.apiToken) {
      this.setState({loggedIn: true});
    }

    // Clear API token when user has logged out
    if(!user && !isEmpty(apiToken)) {
      clearApiToken();
      this.stopApiTokenTimer();

      // If user has pressed logout button move to lease list page
      if(!loggedIn) {
        history.push(getRouteById(Routes.LEASES));
      }
    }
  }

  handleLogin = (event: any) => {
    const {location: {pathname, search}} = this.props;

    event.preventDefault();
    userManager.signinRedirect();

    setRedirectUrlToSessionStorage(`${pathname}${search}` || getRouteById(Routes.LEASES));
  }

  logOut = () => {
    this.setState({
      loggedIn: false,
    }, () => {
      userManager.removeUser();
      sessionStorage.clear();
    });

  }

  checkApiToken () {
    const {apiTokenExpires, fetchApiToken} = this.props;

    if((apiTokenExpires <= getEpochTime()) && get(this.props, 'user.access_token')) {
      fetchApiToken(this.props.user.access_token);
    }
  }

  toggleSideMenu = () => {
    return this.setState({
      displaySideMenu: !this.state.displaySideMenu,
    });
  };

  handleDismissErrorModal = () => {
    this.props.closeReveal('apiError');
    this.props.clearError();
  };

  render() {
    const {apiError,
      apiToken,
      children,
      isApiTokenFetching,
      linkUrl,
      location,
      pageTitle,
      showSearch,
      user,
      userGroups,
    } = this.props;
    const {displaySideMenu} = this.state;
    const appStyle = (IS_DEVELOPMENT_URL) ? 'app-dev' : 'app';

    if (isEmpty(user) || isEmpty(apiToken)) {
      return (
        <div className={appStyle}>
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

          <ApiErrorModal size={Sizes.MEDIUM}
            data={apiError}
            isOpen={Boolean(apiError)}
            handleDismiss={this.handleDismissErrorModal}
          />

          <LoginPage buttonDisabled={Boolean(isApiTokenFetching)} onLoginClick={this.handleLogin}/>
          <Loader isLoading={Boolean(isApiTokenFetching)} />

          {location.pathname === getRouteById(Routes.CALLBACK) && children}
        </div>
      );
    }

    return (
      <AppProvider>
        <AppConsumer>
          {({
            isConfirmationModalOpen,
            confirmationFunction,
            confirmationModalButtonClassName,
            confirmationModalButtonText,
            confirmationModalLabel,
            confirmationModalTitle,
            dispatch,
          }) => {
            const handleConfirmation = () => {
              confirmationFunction();
              handleHideConfirmationModal();
            };

            const handleHideConfirmationModal = () => {
              dispatch({type: ActionTypes.HIDE_CONFIRMATION_MODAL});
            };

            return(
              <div className={appStyle}>
                <ApiErrorModal size={Sizes.LARGE}
                  data={apiError}
                  isOpen={Boolean(apiError)}
                  handleDismiss={this.handleDismissErrorModal}
                />

                <ConfirmationModal
                  confirmButtonClassName={confirmationModalButtonClassName}
                  confirmButtonLabel={confirmationModalButtonText}
                  isOpen={isConfirmationModalOpen}
                  label={confirmationModalLabel}
                  onCancel={handleHideConfirmationModal}
                  onClose={handleHideConfirmationModal}
                  onSave={handleConfirmation}
                  title={confirmationModalTitle}
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
                  onLogout={this.logOut}
                  pageTitle={pageTitle}
                  showSearch={showSearch}
                  toggleSideMenu={this.toggleSideMenu}
                  userGroups={userGroups}
                  username={get(user, 'profile.name')}
                />

                <section className="app__content">
                  <SideMenu
                    isOpen={displaySideMenu}
                    onLinkClick={this.toggleSideMenu}
                  />
                  <div className='wrapper'>
                    {children}
                  </div>
                </section>
              </div>
            );
          }}
        </AppConsumer>
      </AppProvider>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  const user = getLoggedInUser(state);

  if (!user || user.expired) {
    return {
      apiToken: getApiToken(state),
      pageTitle: getPageTitle(state),
      showSearch: getShowSearch(state),
      user: null,
    };
  }

  return {
    apiError: getError(state),
    apiToken: getApiToken(state),
    apiTokenExpires: getApiTokenExpires(state),
    isApiTokenFetching: getIsFetching(state),
    linkUrl: getLinkUrl(state),
    pageTitle: getPageTitle(state),
    showSearch: getShowSearch(state),
    user,
    userGroups: getUserGroups(state),
  };
};

export default flowRight(
  withRouter,
  connect(
    mapStateToProps,
    {
      clearError,
      clearApiToken,
      fetchApiToken,
    },
  ),
  revealContext(),
)(App);
