// @flow
import React from 'react';
import classNames from 'classnames';

import trashIcon from '$assets/icons/trash.svg';

type Props = {
  className?: string,
  onClick: Function,
  title: string,
  type?: string,
}

const RemoveButton = ({className, onClick, title, type = 'button'}: Props) =>
  <button
    className={classNames('remove-button', className)}
    type={type}
    title={title}
    onClick={onClick}>
    <img src={trashIcon} alt='Poista' />
  </button>;

export default RemoveButton;
