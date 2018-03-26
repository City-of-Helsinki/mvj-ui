// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  children?: any,
  className?: string,
}

const GreenBoxEdit = ({children, className}: Props) =>
  <div className={classNames('green-box-edit', className)}>{children}</div>;

export default GreenBoxEdit;
