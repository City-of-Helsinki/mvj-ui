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
    className={classNames('add-button', className)}
    disabled={disabled}
    onClick={() => onClick()}
    title={title || label}
    type='button'
    >+&nbsp;{label}</button>;


export default AddButton;
