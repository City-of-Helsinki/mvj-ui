// @flow
import React from 'react';

type Props = {
  children?: any;
}

const CollapseHeaderSubtitle = ({children}: Props) =>
  <span className='collapse__header_subtitle'>{children}</span>;

export default CollapseHeaderSubtitle;
