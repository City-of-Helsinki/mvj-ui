// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  children?: any,
  className?: string,
}

const WhiteBoxEdit = ({children, className}: Props) =>
  <div className={classNames('white-box-edit', className)}>{children}</div>;

export default WhiteBoxEdit;
