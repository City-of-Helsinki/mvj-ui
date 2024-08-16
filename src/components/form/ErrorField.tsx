import React from "react";
type Props = {
  meta: Record<string, any>;
  showError: boolean;
  style?: Record<string, any>;
};

const ErrorField = ({
  meta: {
    error
  },
  showError = false,
  style
}: Props): JSX.Element => showError && error ? <span className="form-field__error-field" role="alert" style={style}>{error}</span> : null;

export default ErrorField;