// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
  text: any,
}

const RightSubtitle = ({className, text}: Props) =>
  <p className={classNames('right-subtitle', className)}>{text}</p>;

export default RightSubtitle;
