import React from "react";
type Props = {
  error: string;
};

const ErrorBlock = ({
  error
}: Props): React.ReactNode => <span className="form-field__error-block" role="alert">{error}</span>;

export default ErrorBlock;