// @flow
import React from 'react';

type Props = {
  children?: any,
}

const SubsectionContent = ({children}: Props) =>
  <div className='subsection-content'>{children}</div>;

export default SubsectionContent;
