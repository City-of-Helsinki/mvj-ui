// @flow
import React from 'react';

type Props = {
  children: any,
}

const WarningContainer = ({
  children,
}: Props) =>
  <div className='content__warning-container'>
    <div className='content__warning-container_empty-space'></div>
    <div className='content__warning-container_wrapper'>{children}</div>
    <i/>
  </div>;

export default WarningContainer;
