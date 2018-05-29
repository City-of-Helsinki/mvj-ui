// @flow
import React from 'react';

type Props = {
  children?: any,
}

const SubTitle = ({children}: Props) =>
  <p className='sub-title'>{children}</p>;

export default SubTitle;
