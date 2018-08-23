// @flow
import React from 'react';
import classNames from 'classnames';

import trashIcon from '$assets/icons/trash.svg';

type Props = {
  className?: string,
  disabled?: boolean,
  onClick: Function,
  title: string,
  type?: string,
}

const RemoveButton = ({className, disabled, onClick, title, type = 'button'}: Props) =>
  <button
    className={classNames('form__remove-button', className)}
    disabled={disabled}
    type={type}
    title={title}
    onClick={onClick}>
    <img src={trashIcon} alt='Poista' />
  </button>;

export default RemoveButton;
