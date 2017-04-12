// @flow

import flowRight from 'lodash/flowRight';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {Row, Column} from 'react-foundation';
import {performLogin} from './actions';
import {getIsAuthenticated} from './selectors';
import {translate} from 'react-i18next';
import i18n from '../root/i18n';
import {setPageTitle} from '../helpers';

type Props = {
  router: any,
  isAuthenticated: boolean,
  performLogin: typeof performLogin,
  t: Function,
};

class LoginPage extends Component {
  props: Props;

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    i18n.on('languageChanged', this.onLanguageChange);
  }

  onLanguageChange = (language) => {
    this.context.router.push(`/${language}/login`);
  };

  componentDidMount() {
    const {t} = this.props;
    setPageTitle(t('title'));

    this.checkIsAuthenticated(this.props.isAuthenticated);
  }

  componentWillReceiveProps({isAuthenticated}: Props) {
    this.checkIsAuthenticated(isAuthenticated);
  }

  checkIsAuthenticated(isAuthenticated: boolean) {
    if (isAuthenticated) {
      this.props.router.push('/');
    }
  }

  handleSubmit = ({username, password}: { username: string, password: string }) => { // eslint-disable-line
    // this.props.performLogin(username, password);
  };

  render() {
    const {t} = this.props;
    return (
      <div className="auth-login">
        <Row>
          <Column>
            <h1 className="auth-login__title">
              {t('title')}
            </h1>
            <div className="auth-login__content">
              <p className="auth-login__description">{t('description')}</p>
            </div>
          </Column>
        </Row>
      </div>
    );
  }
}

export default flowRight(
  connect(
    (state) => ({
      isAuthenticated: getIsAuthenticated(state),
    }),
    {
      performLogin,
    },
  ),
  translate(['login']),
  withRouter,
)(LoginPage);
