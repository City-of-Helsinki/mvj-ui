// @flow
import React from 'react';

type Props = {
  meta: Object,
  showError: boolean,
};

const ErrorField = ({meta: {error}, showError = false}: Props) =>
  (showError && error) ? <span className="form-field__error-field" role="alert">{error}</span> : null;

export default ErrorField;
