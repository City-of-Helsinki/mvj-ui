// @flow
import React from 'react';

type Props = {
  children?: any;
}

const CollapseHeaderTitle = ({children}: Props) =>
  <span className='collapse__header_title'>{children}</span>;

export default CollapseHeaderTitle;
