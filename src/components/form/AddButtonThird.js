// @flow
import React from 'react';
import classNames from 'classnames';

import AddIcon from '$components/icons/AddIcon';

type Props = {
  className?: string,
  label: string,
  onClick: Function,
  style?: Object,
  title?: string,
}

const AddButtonThird = ({className, label, onClick, style, title}: Props) =>
  <button
    className={classNames('form__add-button third-level', className)}
    onClick={onClick}
    style={style}
    title={title}
    type='button'
  >
    <AddIcon />
    <span>{label}</span>
  </button>;

export default AddButtonThird;
