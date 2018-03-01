// @flow
import React from 'react';
type Props = {
  children?: any,
}

const PageContainer = ({children}: Props) =>
  <div className='page-container'>{children}</div>;

export default PageContainer;
