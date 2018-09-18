// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  children?: any,
  className?: string,
}

const FormText = ({
  children,
  className,
}: Props) => <p  className={classNames('form__text', className)}>{children}</p>;

export default FormText;
