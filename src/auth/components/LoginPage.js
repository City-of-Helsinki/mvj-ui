import React from 'react';
import userManager from '../util/user-manager';

type Props = {
  location: Object,
}

class LoginPage extends React.Component {
  props: Props
  onLoginButtonClick(event) {
    event.preventDefault();
    userManager.signinRedirect();
  }

  componentDidMount() {
    if (this.props.location && this.props.location.pathname == '/logout/') {
      userManager.removeUser();
    }
  }

  render() {
    return (
      <div className="login-page">
        <div className="login-page__content">
          <div className="helsinki-logo" />
          <h3>Tervetuloa Helsingin maavuokrausjärjestelmään</h3>
          <p>Kirjaudu sisään jatkaaksesi</p>
          <button className="btn btn-default" onClick={this.onLoginButtonClick}>Kirjaudu</button>
        </div>
        <div className="login-koro" />
        <div className="login-footer" />
      </div>
    );
  }
}


export default LoginPage;
