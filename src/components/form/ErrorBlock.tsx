import React from "react";
type Props = {
  error: string;
};

const ErrorBlock = ({
  error
}: Props): JSX.Element => <span className="form-field__error-block" role="alert">{error}</span>;

export default ErrorBlock;