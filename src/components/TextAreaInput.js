// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
  disabled?: boolean,
  onChange: Function,
  placeholder?: string,
  rows?: number,
  value: string,
}

const TextAreaInput = ({className, disabled, onChange, placeholder = '', rows = 3, value = ''}: Props) => {
  return (
    <textarea
      className={classNames('text-area-input', className)}
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      value={value}
    />
  );
};

export default TextAreaInput;
