// @flow

import flowRight from 'lodash/flowRight';
import React from 'react';
import {reduxForm, Field} from 'redux-form';
import {translate} from 'react-i18next';
import {Button} from 'react-foundation';

type Props = {
  handleSubmit: Function,
  submitting: boolean,
  t: Function,
}

const LoginForm = ({handleSubmit, submitting, t}: Props) => (
  <form className="auth-login-form" onSubmit={handleSubmit}>
    <label className="auth-login-form__label">
      {t('emailLabel')}
      <Field name="username" placeholder="name@company.com" component="input" type="text"/>
    </label>
    <label className="auth-login-form__label">
      {t('passwordLabel')}
      <Field name="password" placeholder="********" component="input" type="password"/>
    </label>
    <Button className="auth-login-form__submit" type="submit" isDisabled={submitting} isExpanded isHollow>
      {t('submitButtonLabel')}
    </Button>
  </form>
);

export default flowRight(
  reduxForm({form: 'login'}),
  translate(['login']),
)(LoginForm);
