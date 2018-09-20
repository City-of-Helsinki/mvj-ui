// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  children?: any,
  className?: string,
  style?: Object,
}

const FormText = ({
  children,
  className,
  style,
}: Props) => <p  className={classNames('form__text', className)} style={style}>{children}</p>;

export default FormText;
