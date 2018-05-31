// @flow
import React from 'react';

type Props = {
  children: any,
}

const LoaderWrapper = ({children}: Props) => <div className="loader__wrapper">{children}</div>;

export default LoaderWrapper;
