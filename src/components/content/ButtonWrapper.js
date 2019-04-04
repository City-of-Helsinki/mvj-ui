// @flow
import React from 'react';

type Props = {
  children: any,
}

const ButtonWrapper = ({children}: Props) =>
  <div className='content__button-wrapper'>{children}</div>;

export default ButtonWrapper;
