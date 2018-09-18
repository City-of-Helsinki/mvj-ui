// @flow
import React from 'react';
import classNames from 'classnames';

import TrashIcon from '$components/icons/TrashIcon';

type Props = {
  className?: string,
  disabled?: boolean,
  onClick: Function,
  title?: string,
  type?: string,
}

const RemoveButton = ({className, disabled, onClick, title, type = 'button'}: Props) =>
  <button
    className={classNames('form__remove-button', className)}
    disabled={disabled}
    type={type}
    title={title}
    onClick={onClick}
  >
    <TrashIcon className='icon-medium'/>
  </button>;

export default RemoveButton;
