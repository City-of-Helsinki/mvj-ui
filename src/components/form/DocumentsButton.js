// @flow
import React from 'react';
import classNames from 'classnames';

import DocIcon from '$components/icons/DocIcon';

type Props = {
  className?: string,
  disabled?: boolean,
  label: string,
  onClick: Function,
  style?: Object,
  title?: string,
}

const AddButton = ({className, disabled = false, label, onClick, style, title}: Props): React$Node =>
  <button
    className={classNames('form__add-button', className)}
    disabled={disabled}
    onClick={onClick}
    style={style}
    title={title}
    type='button'
  >
    <span>{label}</span>
    <DocIcon />
  </button>;


export default AddButton;
