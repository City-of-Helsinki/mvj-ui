// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
  disabled?: boolean,
  onChange: Function,
  placeholder?: string,
  rows?: number,
  setRefForField?: Function,
  value: string,
}

const TextAreaInput = ({className, disabled, onChange, placeholder = '', rows = 3, setRefForField, value = ''}: Props) => {
  return (
    <textarea
      ref={setRefForField}
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
