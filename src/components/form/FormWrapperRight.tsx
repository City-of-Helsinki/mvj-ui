import React from "react";
type Props = {
  children?: any;
};

const FormWrapperRight = ({
  children
}: Props): JSX.Element => <div className='form-wrapper__right'>{children}</div>;

export default FormWrapperRight;