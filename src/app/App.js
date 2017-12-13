// @flow

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import {Sizes} from '../foundation/enums';
import {revealContext} from '../foundation/reveal';
import classnames from 'classnames';

import {clearError} from '../api/actions';
import {getError} from '../api/selectors';
import ApiErrorModal from '../api/ApiErrorModal';
import LoginPage from '../auth/components/LoginPage';
import {loggedInUser} from '../auth/selectors';
import SideMenu from '../components/sideMenu/SideMenu';
import TopNavigation from '../components/topNavigation/TopNavigation';

import type {ApiError} from '../api/types';
import type {RootState} from '../root/types';

type Props = {
  apiError: ApiError,
  children: any,
  clearError: typeof clearError,
  closeReveal: Function,
  location: Object,
  params: Object,
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
    const {apiError, children, location, user} = this.props;
    const {displaySideMenu} = this.state;

    if (location.pathname !== '/callback' && !user) {
      return <LoginPage />;
    }

    return (
      <div className={'app'}>
        <TopNavigation toggleSideMenu={this.toggleSideMenu}/>
        <section className="app__content">
          <SideMenu isOpen={displaySideMenu} />
          <div className={classnames('wrapper', {'is-sidemenu-closed': !displaySideMenu}, {'is-sidemenu-open': displaySideMenu})}>{children}</div>
        </section>
        <ReduxToastr
          timeOut={4000}
          newestOnTop={true}
          preventDuplicates={true}
          position='top-right'
          transitionIn='fadeIn'
          transitionOut='bounceOutUp'
          progressBar={true}
        />
        <ApiErrorModal size={Sizes.LARGE}
          data={apiError}
          isOpen={Boolean(apiError)}
          handleDismiss={this.handleDismissErrorModal}/>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  const user = loggedInUser(state);
  if (!user || user.expired) {
    return {user: null};
  }
  return {
    apiError: getError(state),
    user,
    // entries: state.data.entry,
    // tasks: state.data.task,
    // apiToken: state.apiToken
  };
};

export default flowRight(
  withRouter,
  connect(
    mapStateToProps,
    {
      clearError,
    },
  ),
  revealContext(),
)(App);
