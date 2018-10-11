// @flow
import React from 'react';
import classNames from 'classnames';

import AddIcon from '$components/icons/AddIcon';

type Props = {
  className?: string,
  disabled?: boolean,
  label: string,
  onClick: Function,
  title?: string,
}

const AddButtonSecondary = ({className, disabled = false, label, onClick, title}: Props) =>
  <button
    className={classNames('form__add-button secondary', className)}
    disabled={disabled}
    onClick={onClick}
    title={title}
    type='button'
  >
    <AddIcon />
    <span>{label}</span>
  </button>;


export default AddButtonSecondary;
