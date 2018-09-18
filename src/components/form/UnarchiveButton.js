// @flow
import React from 'react';
import classNames from 'classnames';

import UnarchiveIcon from '$components/icons/UnarchiveIcon';

type Props = {
  className?: string,
  disabled?: boolean,
  onClick: Function,
  title?: string,
  type?: string,
}

const UnarchiveButton = ({className, disabled, onClick, title, type = 'button'}: Props) =>
  <button
    className={classNames('form__unarchive-button', className)}
    disabled={disabled}
    type={type}
    title={title}
    onClick={onClick}>
    <UnarchiveIcon className='icon-medium'/>
  </button>;

export default UnarchiveButton;
