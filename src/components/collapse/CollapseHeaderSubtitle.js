// @flow
import React from 'react';

type Props = {
  children?: any;
}

const CollapseHeaderSubtitle = ({children}: Props): React$Node =>
  <span className='collapse__header_subtitle'>{children}</span>;

export default CollapseHeaderSubtitle;
