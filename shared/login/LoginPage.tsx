import React from "react";
import {
  Button,
  ButtonVariant,
  Koros,
  Logo,
  LogoSize,
  logoFi,
} from "hds-react";
import styles from "./LoginPage.module.scss";

type Props = {
  buttonDisabled: boolean;
  onLoginClick: () => void;
};

const LoginPage: React.FC<Props> = ({ buttonDisabled, onLoginClick }) => (
  <main className={styles.page}>
    <div className={styles.content}>
      <Logo
        className={styles.logo}
        src={logoFi}
        size={LogoSize.Medium}
        alt="Helsinki"
      />
      <h1 className={styles.title}>Helsingin maanvuokrausjärjestelmä</h1>
      <Button
        variant={ButtonVariant.Secondary}
        disabled={buttonDisabled}
        onClick={onLoginClick}
      >
        Kirjaudu
      </Button>
    </div>
    <Koros className={styles.koros} type="basic" aria-hidden="true" />
    <div className={styles.footer} aria-hidden="true" />
  </main>
);

export default LoginPage;
