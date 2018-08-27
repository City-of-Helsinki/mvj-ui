// @flow
import React from 'react';
import classNames from 'classnames';

import unarchiveIcon from '$assets/icons/icon_unarchive.svg';

type Props = {
  className?: string,
  disabled?: boolean,
  onClick: Function,
  title: string,
  type?: string,
}

const UnarchiveButton = ({className, disabled, onClick, title, type = 'button'}: Props) =>
  <button
    className={classNames('form__unarchive-button', className)}
    disabled={disabled}
    type={type}
    title={title}
    onClick={onClick}>
    <img src={unarchiveIcon} alt='Poista arkistosta' />
  </button>;

export default UnarchiveButton;
