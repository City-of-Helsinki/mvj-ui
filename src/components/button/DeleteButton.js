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

const DeleteButton = ({className, onClick, title, type = 'button'}: Props) =>
  <button
    className={classNames('icon-button-component', className)}
    onClick={() => onClick()}
    title={title}
    type={type}
    >
    <img src={trashIcon} alt='Muokkaa' />
  </button>;

export default DeleteButton;
