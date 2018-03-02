// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  children?: any,
  className?: string,
}

const GreenBox = ({children, className}: Props) =>
  <div className={classNames('green-box', className)}>{children}</div>;

export default GreenBox;
