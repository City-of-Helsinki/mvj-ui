// @flow
import React from 'react';

type Props = {
  children?: any,
}

const GreenBox = ({children}: Props) =>
  <div className="green-box">{children}</div>;

export default GreenBox;
