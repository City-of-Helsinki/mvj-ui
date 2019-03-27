// @flow
import React from 'react';

type Props = {
  children: any,
}

const PageNavigationWrapper = ({
  children,
}: Props) =>
  <div className='content__page-navigator-wrapper'>
    {children}
  </div>;

export default PageNavigationWrapper;
