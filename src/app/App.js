// @flow
import flowRight from 'lodash/flowRight';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Sizes} from '../foundation/enums';
import {revealContext} from '../foundation/reveal';
import i18n from '../root/i18n';
import {withRouter} from 'react-router';

import {clearError} from '../api/actions';
import {getError} from '../api/selectors';
import ApiErrorModal from '../api/ApiErrorModal';
import ReduxToastr from 'react-redux-toastr';
import {isAllowedLanguage} from '../util/helpers';
import {Languages} from '../constants';

import type {ApiError} from '../api/types';
import type {RootState} from '../root/types';
import TopNavigation from '../components/topNavigation/TopNavigation';
import {fetchUsers} from '../role/actions';

type Props = {
  apiError: ApiError,
  children: any,
  clearError: typeof clearError,
  closeReveal: Function,
  fetchUsers: Function,
  params: Object,
  route: Object,
};

class App extends Component {
  props: Props;

  static contextTypes = {
    router: React.PropTypes.object,
  };

  componentDidMount() {
    const {
      fetchUsers,
      params: {language},
    } = this.props;

    if (language !== i18n.language) {
      if (isAllowedLanguage(language)) {
        i18n.changeLanguage(language);
      } else {
        i18n.changeLanguage(Languages.EN);
      }
    }

    fetchUsers();
  }

  handleDismissErrorModal = () => {
    this.props.closeReveal('apiError');
    this.props.clearError();
  };

  render() {
    const {apiError, children} = this.props;

    return (
      <section className="app">
        <TopNavigation/>
        <section className="app__content">
          {children}
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
      </section>
    );
  }
}

export default flowRight(
  withRouter,
  connect(
    (state: RootState) => ({
      apiError: getError(state),
    }),
    {
      fetchUsers,
      clearError,
    },
  ),
  revealContext(),
)(App);
