// @flow
import React from 'react';

type Props = {
  children?: any,
}

const FormWrapper = ({children}: Props): React$Node =>
  <div className='form-wrapper'>{children}</div>;

export default FormWrapper;
