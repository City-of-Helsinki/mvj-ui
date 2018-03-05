// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
  label: string,
  onClick: Function,
  title: ?string,
}

const AddButton = ({className, label, onClick, title}: Props) =>
  <button
    className={classNames('add-button', className)}
    onClick={() => onClick()}
    title={title || label}
    type='button'
    >
    {label}
  </button>;


export default AddButton;
