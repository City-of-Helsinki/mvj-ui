import React from "react";
type Props = {
  children?: any;
};

const FormWrapperLeft = ({ children }: Props): JSX.Element => (
  <div className="form-wrapper__left">{children}</div>
);

export default FormWrapperLeft;
