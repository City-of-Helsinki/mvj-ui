import React from "react";
type Props = {
  children?: any;
};

const FormWrapper = ({
  children
}: Props): JSX.Element => <div className='form-wrapper'>{children}</div>;

export default FormWrapper;