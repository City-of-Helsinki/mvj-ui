import React from 'react';
import PropTypes from 'prop-types';
import userManager from '../util/user-manager';

type Props = {
  buttonDisabled: PropTypes.boolean,
  location: Object,
}

class LoginPage extends React.Component {
  props: Props
  onLoginButtonClick(event) {
    event.preventDefault();
    userManager.signinRedirect();
  }

  componentDidMount() {
    const {location} = this.props;
    if (location && location.pathname == '/logout/') {
      userManager.removeUser();
    }
  }

  render() {
    const {buttonDisabled} = this.props;
    return (
      <div className="login-page">
        <div className="login-page__content">
          <div className="helsinki-logo" />
          <h3>Tervetuloa Helsingin maavuokrausjärjestelmään</h3>
          <p>Kirjaudu sisään jatkaaksesi</p>
          <button className="btn btn-default" disabled={buttonDisabled} onClick={this.onLoginButtonClick}>Kirjaudu</button>
        </div>
        <div className="login-koro" />
        <div className="login-footer" />
      </div>
    );
  }
}


export default LoginPage;
