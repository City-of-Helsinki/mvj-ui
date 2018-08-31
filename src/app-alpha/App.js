// @flow
import flowRight from 'lodash/flowRight';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Sizes} from '../foundation/enums';
import {revealContext} from '../foundation/reveal';
// import i18n from '../root/i18n';
import {withRouter} from 'react-router';
import isEmpty from 'lodash/isEmpty';

import {clearError} from '../api/actions';
import {getError} from '../api/selectors';
import ApiErrorModal from '../api/ApiErrorModal';
import ReduxToastr from 'react-redux-toastr';

import type {ApiError} from '../api/types';
import type {RootState} from '../root/types';
import TopNavigation from '../components-alpha/topNavigation/TopNavigation';
import {changeUser, fetchUsers} from '../role/actions';
import {getStorageItem} from '../util/storage';
import {getUser, getUserList} from '../role/selectors';
// import {fetchAttributes} from '../attributes/actions';

import type {UserState} from '../role/types';

type Props = {
  apiError: ApiError,
  changeUser: Function,
  children: any,
  clearError: typeof clearError,
  closeReveal: Function,
  currentUser: Object,
  userList: UserState,
  fetchAttributes: Function,
  fetchUsers: Function,
  params: Object,
  route: Object,
};

class App extends Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    // const {
    //   params: {language},
    // } = this.props;

    // if (language !== i18n.language) {
    //   if (isAllowedLanguage(language)) {
    //     i18n.changeLanguage(language);
    //   } else {
    //     i18n.changeLanguage(Languages.EN);
    //   }
    // }

    this.doInitialLoad();
  }

  componentWillReceiveProps(nextProps: Object) {
    const {userList} = nextProps;
    const {changeUser, currentUser} = this.props;
    const token = getStorageItem('TOKEN');

    if (token) {
      if (userList.length && isEmpty(currentUser)) {
        const user = userList.find(({username}) => username === token);
        changeUser(user);
      }
    } else {
      // TODO: Do something if there's no token in localStorage
    }
  }

  doInitialLoad = () => {
    const {fetchUsers} = this.props;
    fetchUsers();
  };

  handleDismissErrorModal = () => {
    this.props.closeReveal('apiError');
    this.props.clearError();
  };

  render() {
    const {apiError, children} = this.props;

    return (
      <section className="app-alpha">
        <TopNavigation/>
        <section className="app-alpha__content">
          {children}
        </section>
        <ReduxToastr
          timeOut={4000}
          newestOnTop={true}
          preventDuplicates={true}
          position='top-right'
          transitionIn='fadeIn'
          transitionOut='bounceOutUp'
          progressBar={false}
          closeOnToastrClick={true}
        />
        <ApiErrorModal size={Sizes.LARGE}
          data={apiError}
          isOpen={Boolean(apiError)}
          handleDismiss={this.handleDismissErrorModal}/>
      </section>
    );
  }
}

export default flowRight(
  withRouter,
  connect(
    (state: RootState) => ({
      apiError: getError(state),
      userList: getUserList(state),
      currentUser: getUser(state),
    }),
    {
      fetchUsers,
      changeUser,
      clearError,
    },
  ),
  revealContext(),
)(App);
