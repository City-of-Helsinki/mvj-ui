// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  children?: any,
  className?: string,
}

const WhiteBox = ({children, className}: Props) =>
  <div className={classNames('content__white-box', className)}>{children}</div>;

export default WhiteBox;
