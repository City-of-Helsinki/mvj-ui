// @flow
import React from 'react';

import BackIcon from '$components/icons/BackIcon';
import IconButton from './IconButton';

type Props = {
  className?: string,
  onClick: Function,
  title?: string,
  type?: string,
}

const BackButton = ({className, onClick, title, type = 'button'}: Props) =>
  <IconButton
    className={className}
    onClick={onClick}
    title={title}
    type={type}
  >
    <BackIcon />
  </IconButton>;

export default BackButton;
