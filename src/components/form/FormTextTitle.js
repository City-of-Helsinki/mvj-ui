// @flow
import React from 'react';

import Tooltip from '$components/tooltip/Tooltip';

type Props = {
  children?: any,
  infoText?: string,
  required?: boolean,
  title?: string,
}

const FormTextTitle = ({
  children,
  infoText,
  required = false,
  title,
}: Props) => {
  return <p className='form__text-title'>
    {children || title}
    {required &&<i className='required'> *</i>}
    {!!infoText && <Tooltip text={infoText} />}
  </p>;
};

export default FormTextTitle;
