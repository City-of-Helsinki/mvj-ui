import React, {Component} from 'react';
import {withRouter} from 'react-router';

import {setRedirectUrlToSessionStorage} from '../helpers';
import userManager from '../util/user-manager';

type Props = {
  buttonDisabled: boolean,
  history: Object,
  location: Object,
}

class LoginPage extends Component {
  props: Props

  onLoginButtonClick = (event) => {
    const {location: {pathname, search}} = this.props;

    event.preventDefault();
    userManager.signinRedirect();

    setRedirectUrlToSessionStorage(`${pathname}${search}` || '/');
  }

  render() {
    const {buttonDisabled} = this.props;
    return (
      <div className="login-page">
        <div className="login-page__content">
          <div className="helsinki-logo" />
          <h3>Tervetuloa Helsingin maanvuokrausjärjestelmään</h3>
          <p>Kirjaudu sisään jatkaaksesi</p>
          <button className="btn btn-default" disabled={buttonDisabled} onClick={this.onLoginButtonClick}>Kirjaudu</button>
        </div>
        <div className="login-koro" />
        <div className="login-footer" />
      </div>
    );
  }
}


export default withRouter(LoginPage);
