// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  children?: any,
  className?: string,
}

const GreenBoxItem = ({children, className}: Props) =>
  <div className={classNames('green-box-item', className)}>{children}</div>;

export default GreenBoxItem;
