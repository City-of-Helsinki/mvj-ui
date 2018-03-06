// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
  text: any,
}

const RightSubtitle = ({className, text}: Props) =>
  <div className={classNames('right-subtitle', className)}>{text}</div>;

export default RightSubtitle;
