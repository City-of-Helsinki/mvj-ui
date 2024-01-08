// @flow
import React from 'react';

type Props = {
  error: string,
};

const ErrorBlock = ({error}: Props): React$Node =>
  <span className="form-field__error-block" role="alert">{error}</span>;

export default ErrorBlock;
