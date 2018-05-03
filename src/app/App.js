// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import {Sizes} from '../foundation/enums';
import {revealContext} from '../foundation/reveal';

import {getRouteById} from '../root/routes';
import {clearError} from '../api/actions';
import {getError} from '../api/selectors';
import {getLinkUrl, getPageTitle, getShowSearch} from '$components/topNavigation/selectors';
import {getEpochTime} from '$util/helpers';
import ApiErrorModal from '../api/ApiErrorModal';
import {clearApiToken, fetchApiToken} from '../auth/actions';
import {getApiToken, getApiTokenExpires, getIsFetching, getLoggedInUser} from '../auth/selectors';
import LoginPage from '../auth/components/LoginPage';
import userManager from '../auth/util/user-manager';
import Loader from '$components/loader/Loader';
import SideMenu from '$components/sideMenu/SideMenu';
import TopNavigation from '$components/topNavigation/TopNavigation';

import type {ApiError} from '../api/types';
import type {ApiToken} from '../auth/types';
import type {RootState} from '../root/types';

type Props = {
  apiError: ApiError,
  apiToken: ApiToken,
  apiTokenExpires: number,
  children: any,
  clearApiToken: Function,
  clearError: typeof clearError,
  closeReveal: Function,
  fetchApiToken: Function,
  isApiTokenFetching: boolean,
  linkUrl: string,
  location: Object,
  params: Object,
  pageTitle: string,
  showSearch: boolean,
  user: Object,
};

type State = {
  displaySideMenu: boolean,
};

class App extends Component {
  props: Props

  state: State = {
    displaySideMenu: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

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

  componentWillReceiveProps(nextProps) {
    const {apiError, clearApiToken, fetchApiToken} = this.props;
    if(apiError) {
      return;
    }
    // Fetch api token if user info is received but Api token is empty
    if(!nextProps.isApiTokenFetching &&
      nextProps.user &&
      nextProps.user.access_token &&
      (isEmpty(nextProps.apiToken) || (get(this.props, 'user.access_token') !== get(nextProps, 'user.access_token')))
    ) {
      fetchApiToken(nextProps.user.access_token);
      this.startApiTokenTimer();
      return;
    }
    // Clear API token when user has logged out
    if(!nextProps.user && !isEmpty(nextProps.apiToken)) {
      clearApiToken();
      this.stopApiTokenTimer();
    }
  }

  logOut = () => {
    const {router} = this.context;
    router.push('/');

    userManager.removeUser();
    sessionStorage.clear();
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
      user} = this.props;
    const {displaySideMenu} = this.state;

    if (isEmpty(user) || isEmpty(apiToken)) {
      return (
        <div className={'app'}>
          <ApiErrorModal size={Sizes.MEDIUM}
            data={apiError}
            isOpen={Boolean(apiError)}
            handleDismiss={this.handleDismissErrorModal}/>
          <LoginPage buttonDisabled={Boolean(isApiTokenFetching)}/>
          <Loader isLoading={Boolean(isApiTokenFetching)} />

          {location.pathname === getRouteById('callback') &&
            children
          }
        </div>
      );
    }

    return (
      <div className={'app'}>
        <ApiErrorModal size={Sizes.LARGE}
          data={apiError}
          isOpen={Boolean(apiError)}
          handleDismiss={this.handleDismissErrorModal}/>
        <ReduxToastr
          newestOnTop={true}
          position='top-right'
          preventDuplicates={true}
          progressBar={true}
          timeOut={4000}
          transitionIn='fadeIn'
          transitionOut='bounceOutUp'
        />

        <TopNavigation
          linkUrl={linkUrl}
          onLogout={this.logOut}
          pageTitle={pageTitle}
          showSearch={showSearch}
          toggleSideMenu={this.toggleSideMenu}
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
