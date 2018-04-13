// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  children?: any,
  className?: string,
}

const BoxItem = ({children, className}: Props) =>
  <div className={classNames('box-item', className)}>{children}</div>;

export default BoxItem;
