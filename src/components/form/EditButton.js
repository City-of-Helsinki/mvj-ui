// @flow
import React from 'react';
import classNames from 'classnames';

import EditIcon from '$components/icons/EditIcon';

type Props = {
  className?: string,
  disabled?: boolean,
  onClick: Function,
  title: string,
  type?: string,
}

const EditButton = ({className, disabled, onClick, title, type = 'button'}: Props) =>
  <button
    className={classNames('form__edit-button', className)}
    disabled={disabled}
    type={type}
    title={title}
    onClick={onClick}>
    <EditIcon className='icon-medium'/>
  </button>;

export default EditButton;
