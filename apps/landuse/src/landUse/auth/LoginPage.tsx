import React from "react";
type Props = {
  buttonDisabled: boolean;
  onLoginClick: (...args: Array<any>) => any;
};

const LoginPage: React.FC<Props> = ({ buttonDisabled, onLoginClick }) => {
  return (
    <div className="login-page">
      <div className="login-page__content">
        <div className="helsinki-logo" />
        <h3>Tervetuloa Helsingin maanvuokrausjärjestelmään</h3>
        <p>Kirjaudu sisään jatkaaksesi</p>
        <button
          className="btn btn-default"
          disabled={buttonDisabled}
          onClick={onLoginClick}
        >
          Kirjaudu
        </button>
      </div>
      <div className="login-koro" />
      <div className="login-footer" />
    </div>
  );
};

export default LoginPage;
