// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
  disabled?: boolean,
  label: string,
  onClick: Function,
  title: ?string,
}

const AddButton = ({className, disabled = false, label, onClick, title}: Props) =>
  <button
    className={classNames('form__add-button', className)}
    disabled={disabled}
    onClick={onClick}
    title={title || label}
    type='button'
  ><i/><span>{label}</span></button>;


export default AddButton;
