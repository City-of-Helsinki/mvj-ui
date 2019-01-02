// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  children?: any,
  className?: string,
}

const FullWidthContainer = ({children, className}: Props) =>
  <div className={classNames('content__full-width-container', className)}>{children}</div>;

export default FullWidthContainer;
