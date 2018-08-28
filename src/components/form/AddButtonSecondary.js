// @flow
import React from 'react';
import classNames from 'classnames';

import AddIcon from '$components/icons/AddIcon';

type Props = {
  className?: string,
  label: string,
  onClick: Function,
  title: ?string,
}

const AddButtonSecondary = ({className, label, onClick, title}: Props) =>
  <button
    className={classNames('form__add-button secondary', className)}
    onClick={onClick}
    title={title || label}
    type='button'
  >
    <AddIcon />
    <span>{label}</span>
  </button>;


export default AddButtonSecondary;
