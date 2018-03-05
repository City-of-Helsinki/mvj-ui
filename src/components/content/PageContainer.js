// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  children?: any,
  className?: string,
}

const PageContainer = ({children, className}: Props) =>
  <div className={classNames('page-container', className)}>{children}</div>;

export default PageContainer;
