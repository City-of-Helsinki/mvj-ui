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
import Footer from './footer/Footer';
import {isAllowedLanguage} from '../helpers';
import {Languages} from '../constants';

import type {ApiError} from '../api/types';
import type {RootState} from '../root/types';
import TopNavigation from './topNavigation/TopNavigation';

type Props = {
  apiError: ApiError,
  closeReveal: Function,
  clearError: typeof clearError,
  children: any,
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
      params: {language},
    } = this.props;

    if (language !== i18n.language) {
      if (isAllowedLanguage(language)) {
        i18n.changeLanguage(language);
      } else {
        i18n.changeLanguage(Languages.EN);
      }
    }
  }

  handleDismissErrorModal = () => {
    this.props.closeReveal('apiError');
    this.props.clearError();
  };

  render() {
    const {apiError, children} = this.props;

    return (
      <div className="app">
        <TopNavigation/>
        <div className="app__content">
          {children}
        </div>
        <Footer/>
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

export default flowRight(
  withRouter,
  connect(
    (state: RootState) => ({
      apiError: getError(state),
    }),
    {
      clearError,
    },
  ),
  revealContext(),
)(App);
