// @flow
import React from 'react';

type Props = {
  meta: Object,
  showError: boolean,
  style?: Object,
};

const ErrorField = ({meta: {error}, showError = false, style}: Props) =>
  (showError && error) ? <span className="form-field__error-field" role="alert" style={style}>{error}</span> : null;

export default ErrorField;
